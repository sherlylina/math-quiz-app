
let dataSoal, 
    totalSeconds = 0, 
    clearTime, 
    time = 3600,  
    count = 0,
    no = new Audio('./src/sound/no.mp3'),
    yes = new Audio('./src/sound/yes.mp3');

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
  
function mainQuestion(params){
    $.getJSON('./src/json/soal.json', function(json) {
        if(params == 'addition'){
            dataSoal = json.latihan_jumlah;
        }else if(params == 'multiplication'){
            dataSoal = json.latihan_kali;
        }else if(params == 'subtraction'){
            dataSoal = json.latihan_kurang;
        }else if(params == 'division'){
            dataSoal = json.latihan_bagi;
        }else{
            dataSoal = json.session_one;
        }
        if(dataSoal[0].jawaban2){
            let i;
            for(i = 0; i < dataSoal.length ; i++){
                $('.practice').slick('slickAdd',`
                <div class="question" id=${i}>
                    <div class="w-ques">
                        ${dataSoal[i].pertanyaan}
                    </div>
                    <div class="w-choice">
                        <span class="box-answer ans-able">${dataSoal[i].jawaban2[0]}</span>
                        <span class="box-answer ans-able">${dataSoal[i].jawaban2[1]}</span>
                        <span class="box-answer ans-able">${dataSoal[i].jawaban2[2]}</span>
                        <span class="box-answer ans-able">${dataSoal[i].jawaban2[3]}</span>
                    </div>
                </div>`);
            }
        }else{
            shuffle(dataSoal);
            let i;
            clearTime = setInterval(setTime, 1000);
            for(i = 0; i < dataSoal.length ; i++){
                $('.exam-exercise').slick('slickAdd',`
                <div class="question" id=${i}>
                    <div class="soal">
                        <label for="answer-${i}">${dataSoal[i].pertanyaan}</label>
                        <div class="essay-input">
                            <input type="number" placeholder="Write Your Answer Here" id="answer-${i}" name="answer-${i}">
                        </div>
                    </div>
                </div>`);
                if(i == 0){
                    $('.number-exam').append(`
                        <div class="col-1  mt-2">
                            <span class="w-num current">${i+1}</span>
                        </div>
                    `);
                }else{
                    $('.number-exam').append(`
                        <div class="col-1  mt-2">
                            <span class="w-num">${i+1}</span>
                        </div>
                    `);
                }
            }
        }
    });
}

$(document).on('click', '.ans-able', function(){ 
    let ans = $(this).text();
    let ansParent = $(this).parents('.question').attr('id');
    if(count != 3){
        if(ans == dataSoal[ansParent].jawaban){
            Swal.fire({
                icon: 'success',
                title: 'Benar'
            });
            $(this).removeClass('ans-able');
            yes.play();
            count = count + 1;
            if(count == 3){
                $('.back-practice').removeClass('grayscale');
                updateStatus();
            }
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Salah'
            });
            no.play();
        }
    }
}); 

$(document).on('click', '.back-practice', function(){ 
    if(count == 3){
        window.location.href = './menu.html';
        updateStatus();
    }
}); 


// local storage
function resetStatus(){
    window.localStorage.setItem("addition", false);
    window.localStorage.setItem("subtraction", false);
    window.localStorage.setItem("multiplication", false);
    window.localStorage.setItem("division", false);
};

function updateStatus(){
    if($('.main-practice').attr('id') == 'addition'){
        window.localStorage.setItem("addition", true);
    }
    if($('.main-practice').attr('id') == 'subtraction'){
        window.localStorage.setItem("subtraction", true);
    }
    if($('.main-practice').attr('id') == 'multiplication'){
        window.localStorage.setItem("multiplication", true);
    }
    if($('.main-practice').attr('id') == 'division'){
        window.localStorage.setItem("division", true);
    }
};

$(document).on('click', '.w-num', function(){ 
    let ans = $(this).text();
    $('.w-num').removeClass('current');
    $(this).addClass('current');
    $('.exam-exercise').slick('slickGoTo', ans - 1);
}); 


$('#myForm').on('submit', function(e) {
    // Get all the forms elements and their values in one step
    let values = [];
    e.preventDefault();
    $.each($('#myForm').serializeArray(), (i, field) => {
        values.push({"soal": dataSoal[i],"answer": field.value})
    });
    window.localStorage.setItem("result", JSON.stringify(values));
    window.location.href = './result.html';
});


function retrieveResult(){
    let i;
    let count = 0;
    let result = JSON.parse(window.localStorage.getItem("result"));
    if(result){
        for(i = 0; i < result.length; i++){
            if(result[i].answer == result[i].soal.jawaban){
                // $('.result-warp').append(`
                //     <div class="status-answer true">
                //         <h5 class="ans-ques">${result[i].soal.pertanyaan}</h5>
                //         <h5 class="t-f">Benar</h5>
                //         <h5 class="right-ans">Jawabannya Anda yaitu ${result[i].soal.jawaban}</h5>
                //     </div>
                // `);
                count = count + 10;
            }
            // }else{
            //     $('.result-warp').append(`
            //         <div class="status-answer false">
            //             <h5 class="ans-ques">${result[i].soal.pertanyaan}</h5>
            //             <h5 class="t-f">Salah</h5>
            //             <h5 class="right-ans">Jawaban yang benar yaitu ${result[i].soal.jawaban}</h5>
            //         </div>
            //     `);
            // };
        };
    }
    if(count >= 0 && count <= 99){
        $('.star img').attr('src', './src/images/comp/Button-Kayu-Star.png');
    }else if(count >= 100 && count <= 199){
        $('.star img').attr('src', './src/images/comp/Bintang-1.png');
    }else if(count >= 200 && count <= 299){
        $('.star img').attr('src', './src/images/comp/Bintang-2.png');
    }else {
        $('.star img').attr('src', './src/images/comp/Bintang-3.png');
    }
    $('.total').text('Your Score is ' + count);
};

$('#myForm').on('input paste', 'input', function(){
    // Get all the forms elements and their values in one step
    let values = [];
    $.each($('#myForm').serializeArray(), (i, field) => {
        values.push({"soal": dataSoal[i],"answer": field.value});
    });
    let i;
    for(i = 0; i < values.length; i++){
        if(values[i].answer != ''){
            $(`.w-num:eq(${i})`).addClass('active');
        }else{
            $(`.w-num:eq(${i})`).removeClass('active');
        }
    };
    window.localStorage.setItem("result", JSON.stringify(values));
});


$(document).on('click', '.ask-back', function(){ 
    Swal.fire({
        title: 'Make your choice!',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Retry Exam',
        cancelButtonText: 'Main Menu'
        }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "./exam.html"
        }else{  
            window.location.href = "./menu.html";
            resetStatus();
        }
    })
}); 

// timer;
function setTime() {
    ++totalSeconds; 
    $('#minute').text(pad(parseInt(totalSeconds / 60)));
    $('#second').text(pad(totalSeconds % 60));
    if(totalSeconds == time){
        clearInterval(clearTime);
        window.location.href = './result.html';
    }
}

function pad(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}