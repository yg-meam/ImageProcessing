//전역 변수부
var inCanvas, inCtx, outCanvas, outCtx; //입력 캔버스, 입력 통, 출력 캔버스, 출력 통
var inImage, inH, inW; //입력 배열, 입력 높이, 입력 폭
var outImage, outH, outW; //출력 배열, 출력 높이, 출력 폭
var inPaper, outPaper; //입력 종이, 출력 종이
var inFile; //입력 파일

//함수 선언부
function init() {
    inCanvas = document.getElementById("inCanvas"); //입력 캔버스가 '검정색' 바탕의 id="inCanvas"로 접근
    inCtx = inCanvas.getContext('2d'); //입력 캔버스에 칠할 물감, 붓 준비
    outCanvas = document.getElementById("outCanvas"); //출력 캠버스가 '핑크색' 바탕의 id="outCanvas"로 접근
    outCtx = outCanvas.getContext('2d'); //출력 캔버스에 칠할 물감, 붓 준비
}

function openImage() {
    //1. 선택한 파일중 첫번째 파일
    inFile = document.getElementById("inFile").files[0];
    //2. 선택된 파일의 높이, 폭 계산
    inH = inW = Math.floor(Math.sqrt(inFile.size)); // Math.floor : 소수점 버림, Math.sqrt : 제곱근 반환
    //3. 입력 배열에 선택된 파일의 높이, 폭에 맞는 메모리 확보
    inImage = new Array(inH); //입력 높이만큼 배열 생성 [ ] [ ] [ ]

    for (var i = 0; i < inH; i++) {
        inImage[i] = new Array(inW); //입력 폭만큼 생성된 배열을 쪼개기 [ , ,] [ , ,] [ , ,]
    }
    //4. 입력 캔버스 크기 조절
    inCanvas.height = inH;
    inCanvas.width = inW;
    //5. 선택한 파일을 파일의 크기만큼 메모리를 확보한 입력 배열에 넣기
    var reader = new FileReader(); //비동기적으로 데이터를 읽기 위하여 'blob'객체를 사용하기 위함
    //5-1. 선택한 파일을 바이너리 파일(2진 파일)로 읽기
    reader.readAsBinaryString(inFile);
    reader.onload = function () { //function() : 익명 함수
        //5-2. 바이너리 파일(2진 파일)로 읽은 후 'blob' 객체에 넣기
        var blob = reader.result;
        //5-3. 'blob' 객체의 배열을 한 pixel씩 뽑아 입력 배열에 2차원 배열로 넣기
        for (var i = 0; i < inH; i++) {
            for (var k = 0; k < inW; k++) {
                var sPixel = (i * inH + k); //시작 위치
                var ePixel = (i * inW + k) + 1; //끝 위치
                inImage[i][k] = blob.slice(sPixel, ePixel).charCodeAt(0); //slice(시작, 끝) : 지정한 시작부터 끝까지 자름, .charCodeAt(0) : '뺇'--> 253
            }
        }
        displayImage();
    }
}

function displayImage() {
    //6. 입력 배열의 데이터를 받을 빈 종이 준비
    inPaper = inCtx.createImageData(inH, inW);
    //7. 입력 배열의 데이터를 바탕으로 'RGB'를 이용하여 복사
    for (var i = 0; i < inH; i++) {
        for (var k = 0; k < inW; k++) {
            var px = inImage[i][k];

            inPaper.data[(i * inH + k) * 4 + 0] = px; //R
            inPaper.data[(i * inH + k) * 4 + 1] = px; //G
            inPaper.data[(i * inH + k) * 4 + 2] = px; //B
            inPaper.data[(i * inH + k) * 4 + 3] = 255; //Alpha(투명도)
        }
    }
    //8. 입력 캔버스에 종이 부착
    inCtx.putImageData(inPaper, 0, 0); //캔버스의 (0,0)에 맞춤

    //9. 출력 캔버스 크기 조절
    outCanvas.height = outH;
    outCanvas.width = outW;
    //10. 출력 배열의 데이터를 받을 빈 종이 준비
    outPaper = outCtx.createImageData(outH, outW);
    //11. 출력 배열의 데이터를 바탕으로 'RGB'를 이용하여 복사
    for (var i = 0; i < outH; i++) {
        for (var k = 0; k < outW; k++) {
            var px = outImage[i][k];

            outPaper.data[(i * outH + k) * 4 + 0] = px; //R
            outPaper.data[(i * outH + k) * 4 + 1] = px; //G
            outPaper.data[(i * outH + k) * 4 + 2] = px; //B
            outPaper.data[(i * outH + k) * 4 + 3] = 255; //Alpha(투명도)
        }
    }
    //12. 출력 캔버스에 종이 부착
    outCtx.putImageData(outPaper, 0, 0); //캔버스의 (0,0)에 맞춤
}

function selectAlgo(selectNum) {
    // const display = document.querySelectorAll("div.range");
    // display.forEach((el) => {
    //     el.style.display = "none";
    // });
    if (inFile == null) {
        alert("파일을 선택 하세요.");
        return;
    }
    var selectValue = selectNum.getAttribute("value");
    switch (parseInt(selectValue)) {
        case 100:
            //화소점 처리-동일하게
            equal_image();
            break;
        case 101:
            //화소점 처리-밝게
            add_image();
            break;
        case 102:
            //화소점 처리-어둡게
            minus_image();
            break;
        case 103:
            //화소점 처리-반전
            reverse_image();
            break;
        case 104:
            //화소점 처리-흑백
            reverse_image();
            break;
        case 105:
            //화소점 처리-흑백(평균값)
            bw2_image();
            break;
        case 106:
            //화소점 처리-흑백(중위수)
            bw3_image();
            break;

        case 200:
            //기하학 처리-축소
            zoomOut_image();
            break;
        case 201:
            //기하학 처리-확대
            zoomIn_image();
            break;
        case 202:
            //기하학 처리-확대(백워딩)
            zoomIn2_image();
            break;
        case 203:
            //기하학 처리-회전
            rotate_image();
            break;
        // case 204 : enlargeImage(); break;
        case 205:
            //기하학 처리-회전(중앙, 백워딩)
            rotate3_image();
            break;

        case 300:
            //화소영역 처리-엠보싱
            embos_image();
            break;
        case 301:
            //화소영역 처리-블러링
            blur_image();
            break;
        case 302:
            //화소영역 처리-윤곽선 추출
            edge_image();
            break;

        case 400:
            //히스토그램-히스토그램 스트레칭
            histoSt_image();
            break;
        case 401:
            //히스토그램-엔드-인 탐색
            endIn_image();
            break;
        case 402:
            //히스토그램-평활화
            histoEqual_image();
            break;
    }
}

//100: 화소점 처리-동일하게
function equal_image() {
    //13. 출력 높이와 출력 폭 지정
    outH = inH;
    outW = inW;
    //14. 출력 배열에 선택된 파일의 높이, 폭에 맞는 메모리 확보
    outImage = new Array(outH); //출력 높이만큼 배열 생성 [ ] [ ] [ ]

    for (var i = 0; i < outH; i++) {
        outImage[i] = new Array(outW); //출력 폭만큼 생성된 배열을 쪼개기 [ , ,] [ , ,] [ , ,]
    }
    //15. 영상 처리 구현
    for (var i = 0; i < inH; i++) {
        for (var k = 0; k < inW; k++) {
            outImage[i][k] = inImage[i][k];
        }
    }
    displayImage();
}

//101: 화소점 처리-밝게
function add_image() {
    //13. 출력 높이와 출력 폭 지정
    outH = inH;
    outW = inW;
    //14. 출력 배열에 선택된 파일의 높이, 폭에 맞는 메모리 확보
    outImage = new Array(outH); //출력 높이만큼 배열 생성 [ ] [ ] [ ]

    for (var i = 0; i < outH; i++) {
        outImage[i] = new Array(outW); //출력 폭만큼 생성된 배열을 쪼개기 [ , ,] [ , ,] [ , ,]
    }
    //15. 영상 처리 구현
    var value = parseInt(prompt("값", "50"));
    for (var i = 0; i < inH; i++) {
        for (var k = 0; k < inW; k++) {
            if (inImage[i][k] + value < 0)
                outImage[i][k] = 0;
            else if (inImage[i][k] + value > 255)
                outImage[i][k] = 255;
            else
                outImage[i][k] = inImage[i][k] + value;
        }
    }
    displayImage();
}

//102: 화소점 처리-어둡게
function minus_image() {
    //13. 출력 높이와 출력 폭 지정
    outH = inH;
    outW = inW;
    //14. 출력 배열에 선택된 파일의 높이, 폭에 맞는 메모리 확보
    outImage = new Array(outH); //출력 높이만큼 배열 생성 [ ] [ ] [ ]

    for (var i = 0; i < outH; i++) {
        outImage[i] = new Array(outW); //출력 폭만큼 생성된 배열을 쪼개기 [ , ,] [ , ,] [ , ,]
    }
    //15. 영상 처리 구현
    var value = parseInt(prompt("어두운 정도", "100"));

    for (var i = 0; i < inH; i++) {
        for (var k = 0; k < inW; k++) {
            if (inImage[i][k] - value < 0) {
                outImage[i][k] = 0;
            } else {
                outImage[i][k] = inImage[i][k] - value;
            }
        }
    }
    displayImage();
}

//103: 화소점 처리-반전
function reverse_image() {
    //13. 출력 높이와 출력 폭 지정
    outH = inH;
    outW = inW;
    //14. 출력 배열에 선택된 파일의 높이, 폭에 맞는 메모리 확보
    outImage = new Array(outH); //출력 높이만큼 배열 생성 [ ] [ ] [ ]

    for (var i = 0; i < outH; i++) {
        outImage[i] = new Array(outW); //출력 폭만큼 생성된 배열을 쪼개기 [ , ,] [ , ,] [ , ,]
    }
    //15. 영상 처리 구현
    for (var i = 0; i < inH; i++) {
        for (var k = 0; k < inW; k++) {
            if (inImage[i][k] > 128) {
                outImage[i][k] = 0;
            } else {
                outImage[i][k] = 255;
            }
        }
    }
    displayImage();
}

//104: 화소점 처리-흑백
function bw_image() {
    //13. 출력 높이와 출력 폭 지정
    outH = inH;
    outW = inW;
    //14. 출력 배열에 선택된 파일의 높이, 폭에 맞는 메모리 확보
    outImage = new Array(outH); //출력 높이만큼 배열 생성 [ ] [ ] [ ]

    for (var i = 0; i < outH; i++) {
        outImage[i] = new Array(outW); //출력 폭만큼 생성된 배열을 쪼개기 [ , ,] [ , ,] [ , ,]
    }
    //15. 영상 처리 구현
    for (var i = 0; i < inH; i++) {
        for (var k = 0; k < inW; k++) {
            if (inImage[i][k] <= 127)
                outImage[i][k] = 0;
            else
                outImage[i][k] = 255;
        }
    }
    displayImage();
}

//105: 화소점 처리-흑백(평균값)
function bw2_image() {
    //13. 출력 높이와 출력 폭 지정
    outH = inH;
    outW = inW;
    //14. 출력 배열에 선택된 파일의 높이, 폭에 맞는 메모리 확보
    outImage = new Array(outH); //출력 높이만큼 배열 생성 [ ] [ ] [ ]

    for (var i = 0; i < outH; i++) {
        outImage[i] = new Array(outW); //출력 폭만큼 생성된 배열을 쪼개기 [ , ,] [ , ,] [ , ,]
    }
    //15. 영상 처리 구현
    var avgValue, hapValue = 0;

    for (var i = 0; i < inH; i++) {
        for (var k = 0; k < inW; k++) {
            hapValue += inImage[i][k]; // 총합
        }
        avgValue = hapValue / (inH * inW);
    }
    for (var i = 0; i < inH; i++) {
        for (var k = 0; k < inW; k++) {
            if (inImage[i][k] <= avgValue) {
                outImage[i][k] = 0;
            } else {
                outImage[i][k] = 255;
            }
        }
    }
    displayImage();
}

//106: 화소점 처리-흑백(중위수)
function bw3_image() {
    //13. 출력 높이와 출력 폭 지정
    outH = inH;
    outW = inW;
    //14. 출력 배열에 선택된 파일의 높이, 폭에 맞는 메모리 확보
    outImage = new Array(outH); //출력 높이만큼 배열 생성 [ ] [ ] [ ]

    for (var i = 0; i < outH; i++) {
        outImage[i] = new Array(outW); //출력 폭만큼 생성된 배열을 쪼개기 [ , ,] [ , ,] [ , ,]
    }
    //15. 영상 처리 구현
    var centerValue = 0;
    var oneAry = new Array(inH * inW);
    var index = 0;

    for (var i = 0; i < inH; i++) {
        for (var k = 0; k < inW; k++) {
            oneAry[index++] = inImage[i][k];
        }
        oneAry.sort();
    }
    centerValue = oneAry[parseInt((inH * inW) / 2)];

    for (var i = 0; i < inH; i++) {
        for (var k = 0; k < inW; k++) {
            if (inImage[i][k] <= centerValue) {
                outImage[i][k] = 0;
            } else {
                outImage[i][k] = 255;
            }
        }
    }
    displayImage();
}

//200: 기하학 처리-축소
function zoomOut_image() {
    //13. 출력 높이와 출력 폭 지정
    var scale = parseInt(prompt("축소배율", "2"));
    outH = parseInt(inH / scale);
    outW = parseInt(inW / scale);
    //14. 출력 배열에 선택된 파일의 높이, 폭에 맞는 메모리 확보
    outImage = new Array(outH); //출력 높이만큼 배열 생성 [ ] [ ] [ ]

    for (var i = 0; i < outH; i++) {
        outImage[i] = new Array(outW); //출력 폭만큼 생성된 배열을 쪼개기 [ , ,] [ , ,] [ , ,]
    }
    //15. 출력 캔버스 크기 변경
    outCanvas.height = outH;
    outCanvas.width = outW;
    //16. 영상 처리 구현
    for (var i = 0; i < inH; i++) {
        for (var k = 0; k < inW; k++) {
            outImage[parseInt(i / scale)][parseInt(k / scale)] = inImage[i][k];
        }
    }
    displayImage();
}

//201: 기하학 처리-확대
function zoomIn_image() {
    //13. 출력 높이와 출력 폭 지정
    var scale = parseInt(prompt("확대배율", "2"));
    outH = parseInt(inH * scale);
    outW = parseInt(inW * scale);
    //14. 출력 배열에 선택된 파일의 높이, 폭에 맞는 메모리 확보
    outImage = new Array(outH); //출력 높이만큼 배열 생성 [ ] [ ] [ ]

    for (var i = 0; i < outH; i++) {
        outImage[i] = new Array(outW); //출력 폭만큼 생성된 배열을 쪼개기 [ , ,] [ , ,] [ , ,]
    }
    //15. 출력 캔버스 크기 변경
    outCanvas.height = outH;
    outCanvas.width = outW;
    //16. 영상 처리 구현
    for (var i = 0; i < inH; i++) {
        for (var k = 0; k < inW; k++) {
            outImage[parseInt(i * scale)][parseInt(k * scale)] = inImage[i][k];
        }
    }
    displayImage();
}

//202: 기하학 처리-확대(백워딩)
function zoomIn2_image() {
    //13. 출력 높이와 출력 폭 지정
    var scale = parseInt(prompt("확대배율", "2"));
    outH = parseInt(inH * scale);
    outW = parseInt(inW * scale);
    //14. 출력 배열에 선택된 파일의 높이, 폭에 맞는 메모리 확보
    outImage = new Array(outH); //출력 높이만큼 배열 생성 [ ] [ ] [ ]

    for (var i = 0; i < outH; i++) {
        outImage[i] = new Array(outW); //출력 폭만큼 생성된 배열을 쪼개기 [ , ,] [ , ,] [ , ,]
    }
    //15. 출력 캔버스 크기 변경
    outCanvas.height = outH;
    outCanvas.width = outW;
    //16. 영상 처리 구현
    for (var i = 0; i < outH; i++) {
        for (var k = 0; k < outW; k++) {
            outImage[i][k] = inImage[parseInt(i / scale)][parseInt(k / scale)];
        }
    }
    displayImage();
}

//203: 기하학 처리-회전
function rotate_image() {
    //13. 출력 높이와 출력 폭 지정
    outH = inH;
    outW = inW;
    //14. 출력 배열에 선택된 파일의 높이, 폭에 맞는 메모리 확보
    outImage = new Array(outH); //출력 높이만큼 배열 생성 [ ] [ ] [ ]

    for (var i = 0; i < outH; i++) {
        outImage[i] = new Array(outW); //출력 폭만큼 생성된 배열을 쪼개기 [ , ,] [ , ,] [ , ,]
    }
    //15. 영상 처리 구현
    var angle = parseInt(prompt("각도", "45"));
    angle = angle * Math.PI / 180;
    // new_i = cos*i - sin*k
    // new_k = sin*i + cos*k
    for (var i = 0; i < inH; i++) {
        for (var k = 0; k < inW; k++) {
            var new_i = parseInt(Math.cos(angle) * i - Math.sin(angle) * k);
            var new_k = parseInt(Math.sin(angle) * i + Math.cos(angle) * k);
            if (((0 <= new_i) && (new_i < outH)) && ((0 <= new_k) && (new_k < outW))) {
                outImage[new_i][new_k] = inImage[i][k];
            }
        }
    }
    displayImage();
}

//205: 기하학 처리-회전(증앙, 백워딩)
function rotate3_image() {
    //13. 출력 높이와 출력 폭 지정
    outH = inH;
    outW = inW;
    //14. 출력 배열에 선택된 파일의 높이, 폭에 맞는 메모리 확보
    outImage = new Array(outH); //출력 높이만큼 배열 생성 [ ] [ ] [ ]

    for (var i = 0; i < outH; i++) {
        outImage[i] = new Array(outW); //출력 폭만큼 생성된 배열을 쪼개기 [ , ,] [ , ,] [ , ,]
    }
    //15. 영상 처리 구현
    var angle = parseInt(prompt("각도", "45"));
    angle = angle * Math.PI / 180;
    // new_i = cos*(i-cx) - sin*(k-cy) + cx
    // new_k = sin*(i-cx) + cos*(k-cy) + cy
    var cx = parseInt(inH / 2);
    var cy = parseInt(inW / 2);

    for (var i = 0; i < outH; i++) {
        for (var k = 0; k < outW; k++) {
            var old_i = parseInt(Math.cos(angle) * (i - cx) + Math.sin(angle) * (k - cy) + cx);
            var old_k = parseInt(-Math.sin(angle) * (i - cx) + Math.cos(angle) * (k - cy) + cy);
            if (((0 <= old_i) && (old_i < inH)) && ((0 <= old_k) && (old_k < inW))) {
                outImage[i][k] = inImage[old_i][old_k];
            }
        }
    }
    displayImage();
}

//300: 화소영역 처리-엠보싱
function embos_image() {
    //13. 출력 높이와 출력 폭 지정
    outH = inH;
    outW = inW;
    //14. 출력 배열에 선택된 파일의 높이, 폭에 맞는 메모리 확보
    outImage = new Array(outH); //출력 높이만큼 배열 생성 [ ] [ ] [ ]

    for (var i = 0; i < outH; i++) {
        outImage[i] = new Array(outW); //출력 폭만큼 생성된 배열을 쪼개기 [ , ,] [ , ,] [ , ,]
    }
    //15. 영상 처리 구현
    var mask = [[-1.0, 0.0, 0.0],
    [0.0, 0.0, 0.0],
    [0.0, 0.0, 1.0]];
    // 임시 입력 배열 (입력배열+2) ==> 실수 처리
    var tmpInImage = new Array(inH + 2);

    for (var i = 0; i < inH + 2; i++) {
        tmpInImage[i] = new Array(inW + 2);
    }
    // 임시 입력 초기화 (127) --> 평균값? --> 정말로 한줄도 못참는다. (가장자리 가까운 값으로..)
    for (var i = 0; i < inH + 2; i++) {
        for (var k = 0; k < inW + 2; k++) {
            tmpInImage[i][k] = 127.0;
        }
    }
    // 입력 배열 --> 임시 입력 배열의 가운데 쏙~
    for (var i = 0; i < inH; i++) {
        for (var k = 0; k < inW; k++) {
            tmpInImage[i + 1][k + 1] = inImage[i][k];
        }
    }
    // 임시 출력 배열(출력배열과 동일) ==> 실수
    var tmpOutImage = new Array(outH);

    for (var i = 0; i < outH; i++) {
        tmpOutImage[i] = new Array(outW);
    }
    //** 회선 연산 ** 마스크를 잡아서 전체를 긁으면서 계산하기...
    for (var i = 0; i < inH; i++) {
        for (var k = 0; k < inW; k++) {
            var S = 0.0;
            for (var m = 0; m < 3; m++) {
                for (var n = 0; n < 3; n++) {
                    S = S + tmpInImage[i + m][k + n] * mask[m][n];
                }
            }
            tmpOutImage[i][k] = S;
        }
    }
    // 후처리 : 마스크의 합계가 0일 경우.... (예외 있음)
    for (var i = 0; i < outH; i++) {
        for (var k = 0; k < outW; k++) {
            tmpOutImage[i][k] += 127.0;
        }
    }
    // 임시 출력 배열 --> 출력 배열
    for (var i = 0; i < outH; i++) {
        for (var k = 0; k < outW; k++) {
            outImage[i][k] = parseInt(tmpOutImage[i][k]);
        }
    }
    displayImage();
}

//301: 화소영역 처리-블러링
function blur_image() {
    //13. 출력 높이와 출력 폭 지정
    outH = inH;
    outW = inW;
    //14. 출력 배열에 선택된 파일의 높이, 폭에 맞는 메모리 확보
    outImage = new Array(outH); //출력 높이만큼 배열 생성 [ ] [ ] [ ]

    for (var i = 0; i < outH; i++) {
        outImage[i] = new Array(outW); //출력 폭만큼 생성된 배열을 쪼개기 [ , ,] [ , ,] [ , ,]
    }
    //15. 영상 처리 구현
    var mask = [[1 / 9.0, 1 / 9.0, 1 / 9.0],
    [1 / 9.0, 1 / 9.0, 1 / 9.0],
    [1 / 9.0, 1 / 9.0, 1 / 9.0]];
    // 임시 입력 배열 (입력배열+2) ==> 실수 처리
    var tmpInImage = new Array(inH + 2);

    for (var i = 0; i < inH + 2; i++) {
        tmpInImage[i] = new Array(inW + 2);
    }
    // 임시 입력 초기화 (127) --> 평균값? --> 정말로 한줄도 못참는다. (가장자리 가까운 값으로..)
    for (var i = 0; i < inH + 2; i++) {
        for (var k = 0; k < inW + 2; k++) {
            tmpInImage[i][k] = 127.0;
        }
    }
    // 입력 배열 --> 임시 입력 배열의 가운데 쏙~
    for (var i = 0; i < inH; i++) {
        for (var k = 0; k < inW; k++) {
            tmpInImage[i + 1][k + 1] = inImage[i][k];
        }
    }
    // 임시 출력 배열(출력배열과 동일) ==> 실수
    var tmpOutImage = new Array(outH);

    for (var i = 0; i < outH; i++) {
        tmpOutImage[i] = new Array(outW);
    }
    //** 회선 연산 ** 마스크를 잡아서 전체를 긁으면서 계산하기...
    for (var i = 0; i < inH; i++) {
        for (var k = 0; k < inW; k++) {
            var S = 0.0;
            for (var m = 0; m < 3; m++) {
                for (var n = 0; n < 3; n++) {
                    S = S + tmpInImage[i + m][k + n] * mask[m][n];
                }
            }
            tmpOutImage[i][k] = S;
        }
    }
    // 후처리 : 마스크의 합계가 0일 경우.... (예외 있음)
    // for (var i=0; i<outH; i++)
    //     for (var k=0; k<outW; k++)
    //         tmpOutImage[i][k] += 127.0;
    // 임시 출력 배열 --> 출력 배열
    for (var i = 0; i < outH; i++)
        for (var k = 0; k < outW; k++)
            outImage[i][k] = parseInt(tmpOutImage[i][k]);
    displayImage();
}

//302: 화소영역 처리-윤곽선 추출
function edge_image() {
    //13. 출력 높이와 출력 폭 지정
    outH = inH;
    outW = inW;
    //14. 출력 배열에 선택된 파일의 높이, 폭에 맞는 메모리 확보
    outImage = new Array(outH); //출력 높이만큼 배열 생성 [ ] [ ] [ ]

    for (var i = 0; i < outH; i++) {
        outImage[i] = new Array(outW); //출력 폭만큼 생성된 배열을 쪼개기 [ , ,] [ , ,] [ , ,]
    }
    //15. 영상 처리 구현
    var mask = [[0.0, -1.0, 0.0],
    [-1.0, 2.0, 0.0],
    [0.0, 0.0, 0.0]];
    // 임시 입력 배열 (입력배열+2) ==> 실수 처리
    var tmpInImage = new Array(inH + 2);

    for (var i = 0; i < inH + 2; i++) {
        tmpInImage[i] = new Array(inW + 2);
    }
    // 임시 입력 초기화 (127) --> 평균값? --> 정말로 한줄도 못참는다. (가장자리 가까운 값으로..)
    for (var i = 0; i < inH + 2; i++) {
        for (var k = 0; k < inW + 2; k++) {
            tmpInImage[i][k] = 127.0;
        }
    }
    // 입력 배열 --> 임시 입력 배열의 가운데 쏙~
    for (var i = 0; i < inH; i++) {
        for (var k = 0; k < inW; k++) {
            tmpInImage[i + 1][k + 1] = inImage[i][k];
        }
    }
    // 임시 출력 배열(출력배열과 동일) ==> 실수
    var tmpOutImage = new Array(outH);

    for (var i = 0; i < outH; i++) {
        tmpOutImage[i] = new Array(outW);
    }
    //** 회선 연산 ** 마스크를 잡아서 전체를 긁으면서 계산하기...
    for (var i = 0; i < inH; i++) {
        for (var k = 0; k < inW; k++) {
            var S = 0.0;
            for (var m = 0; m < 3; m++) {
                for (var n = 0; n < 3; n++) {
                    S = S + tmpInImage[i + m][k + n] * mask[m][n];
                }
            }
            tmpOutImage[i][k] = S;
        }
    }
    // 후처리 : 마스크의 합계가 0일 경우.... (예외 있음)
    // for (var i=0; i<outH; i++)
    //     for (var k=0; k<outW; k++)
    //         tmpOutImage[i][k] += 127.0;
    // 임시 출력 배열 --> 출력 배열
    for (var i = 0; i < outH; i++) {
        for (var k = 0; k < outW; k++) {
            outImage[i][k] = parseInt(tmpOutImage[i][k]);
        }
    }
    displayImage();
}

//400: 히스토그램-히스토그램 스트레칭
function histoSt_image() {
    //13. 출력 높이와 출력 폭 지정
    outH = inH;
    outW = inW;
    //14. 출력 배열에 선택된 파일의 높이, 폭에 맞는 메모리 확보
    outImage = new Array(outH); //출력 높이만큼 배열 생성 [ ] [ ] [ ]

    for (var i = 0; i < outH; i++) {
        outImage[i] = new Array(outW); //출력 폭만큼 생성된 배열을 쪼개기 [ , ,] [ , ,] [ , ,]
    }
    //15. 영상 처리 구현
    //out = ((in - low) / (high - low) * 255.0)
    var low = inImage[0][0], high = inImage[0][0];
    for (var i = 0; i < inH; i++) {
        for (var k = 0; k < inW; k++) {
            if (inImage[i][k] < low) {
                low = inImage[i][k];
            }
            if (inImage[i][k] > high) {
                high = inImage[i][k];
            }
        }
    }

    for (var i = 0; i < inH; i++) {
        for (var k = 0; k < inW; k++) {
            var out = ((inImage[i][k] - low) / (high - low) * 255.0);
            outImage[i][k] = parseInt(out);
        }
    }
    displayImage();
}

//401: 히스토그램-엔드-인 탐색
function endIn_image() {
    //13. 출력 높이와 출력 폭 지정
    outH = inH;
    outW = inW;
    //14. 출력 배열에 선택된 파일의 높이, 폭에 맞는 메모리 확보
    outImage = new Array(outH); //출력 높이만큼 배열 생성 [ ] [ ] [ ]

    for (var i = 0; i < outH; i++) {
        outImage[i] = new Array(outW); //출력 폭만큼 생성된 배열을 쪼개기 [ , ,] [ , ,] [ , ,]
    }
    //15. 영상 처리 구현
    //out = ((in - low) / (high - low) * 255.0)
    var low = inImage[0][0], high = inImage[0][0];

    for (var i = 0; i < inH; i++) {
        for (var k = 0; k < inW; k++) {
            if (inImage[i][k] < low) {
                low = inImage[i][k];
            }
            if (inImage[i][k] > high) {
                high = inImage[i][k];
            }
        }
    }

    low = low + 50;
    high = high - 50;

    for (var i = 0; i < inH; i++) {
        for (var k = 0; k < inW; k++) {
            var out = ((inImage[i][k] - low) / (high - low) * 255.0);
            outImage[i][k] = parseInt(out);
        }
    }
    displayImage();
}

//402: 히스토그램-평활화
function histoEqual_image() {
    //13. 출력 높이와 출력 폭 지정
    outH = inH;
    outW = inW;
    //14. 출력 배열에 선택된 파일의 높이, 폭에 맞는 메모리 확보
    outImage = new Array(outH); //출력 높이만큼 배열 생성 [ ] [ ] [ ]

    for (var i = 0; i < outH; i++) {
        outImage[i] = new Array(outW); //출력 폭만큼 생성된 배열을 쪼개기 [ , ,] [ , ,] [ , ,]
    }
    //15. 영상 처리 구현
    //15-1. 1단계 : 히스토그램 생성
    var histo = new Array(256);

    for (var i = 0; i < 256; i++) {
        histo[i] = 0;
    }
    for (var i = 0; i < inH; i++) {
        for (var k = 0; k < inW; k++) {
            histo[inImage[i][k]]++;
        }
    }
    //15-2. 2단계 : 누적 히스토그램 생성
    var sumHisto = new Array(256);

    for (var i = 0; i < 256; i++) {
        sumHisto[i] = 0;
    }

    var sumValue = 0;

    for (var i = 0; i < 256; i++) {
        sumValue = sumValue + histo[i];
        sumHisto[i] = sumValue;
    }
    //15-3. 3단계 : 정규화된 누적합 생성
    // n[i] = sumHisto[i] * (1/(inH*inW) * 255.0);
    var n = new Array(256);

    for (var i = 0; i < 256; i++) {
        n[i] = 0.0;
    }
    for (var i = 0; i < 256; i++) {
        n[i] = sumHisto[i] * (1 / (inH * inW) * 255.0);
    }

    //15-4. 4단계 : 정규화된 누적합을 이용해서 픽셀값 변환
    for (var i = 0; i < inH; i++) {
        for (var k = 0; k < inW; k++) {
            outImage[i][k] = parseInt(n[inImage[i][k]]);
        }
    }
    displayImage();
}