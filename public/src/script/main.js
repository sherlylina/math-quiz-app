
let dataSoal, totalSeconds = 0, clearTime, time = 10000, result;

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
                        <span class="box-answer">${dataSoal[i].jawaban2[0]}</span>
                        <span class="box-answer">${dataSoal[i].jawaban2[1]}</span>
                        <span class="box-answer">${dataSoal[i].jawaban2[2]}</span>
                        <span class="box-answer">${dataSoal[i].jawaban2[3]}</span>
                    </div>
                </div>`);
            }
        }else{
            shuffle(dataSoal);
            let i;
            clearTime = setInterval(setTime, 1000);;
            for(i = 0; i < dataSoal.length ; i++){
                $('.exam-exercise').slick('slickAdd',`
                <div class="question" id=${i}>
                    <div class="soal">
                        <label for="answer-${i}">${dataSoal[i].pertanyaan}</label>
                        <div class="bg-kayu">
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
    

$(document).on('click', '.box-answer', function(){ 
    let ans = $(this).text();
    let ansParent = $(this).parents('.question').attr('id');
    if(ans == dataSoal[ansParent].jawaban){
        console.log('bener');
        Swal.fire({
            icon: 'success',
            title: 'Benar'
        });
    }else{
        console.log('salah');
        Swal.fire({
            icon: 'error',
            title: 'Salah'
        });
    }
}); 


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
    // var values = $(this).serialize();
    // console.log(values);
    // console.log('a')
    $.each($('#myForm').serializeArray(), (i, field) => {
        values.push({"soal": dataSoal[i],"answer": field.value})
    });
    result = values;
    retrieveResult();
});

function retrieveResult(){
    let i;
    window.location.hash = 'result';
    let count = 0;
    $('#questions').hide();
    $('#result').show();
    if(result){
        for(i = 0; i < result.length; i++){
            if(result[i].answer == result[i].soal.jawaban){
                $('.result-warp').append(`
                    <div class="status-answer true">
                        <h5 class="ans-ques">${result[i].soal.pertanyaan}</h5>
                        <h5 class="t-f">Benar</h5>
                        <h5 class="right-ans">Jawabannya Anda yaitu ${result[i].soal.jawaban}</h5>
                    </div>
                `);
                count++;
            }else{
                $('.result-warp').append(`
                    <div class="status-answer false">
                        <h5 class="ans-ques">${result[i].soal.pertanyaan}</h5>
                        <h5 class="t-f">Salah</h5>
                        <h5 class="right-ans">Jawaban yang benar yaitu ${result[i].soal.jawaban}</h5>
                    </div>
                `);
            };
        };
    }else{
        $('.result-warp').append(`
            <div class="status-answer">
                <h5 class="ans-ques">Maaf Anda belum menjawab satu soal pun</h5>
            </div>
        `);
    }
    $('.total').text('Your Score is ' + count*10);
}

$('#myForm').on('input paste', 'input', function(){
    // Get all the forms elements and their values in one step
    let values = [];
    // var values = $(this).serialize();
    // console.log(values);
    // console.log('a')
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
    result = values;
});


// timer;
function setTime() {
    ++totalSeconds; 
    $('#minute').text(pad(parseInt(totalSeconds / 60)));
    $('#second').text(pad(totalSeconds % 60));
    if(totalSeconds == time){
        clearInterval(clearTime);
        retrieveResult();
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