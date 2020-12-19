let dataSoal;
let dataAnswer;

function mainSoal(params){
    $.getJSON("/public/src/json/soal.json", function(json) {
        let dataSoal;
        if(params == "latihan_jumlah"){
            dataSoal = json.latihan_jumlah;
        }else if(params == "latihan_kali"){
            dataSoal = json.latihan_kali;
        }else if(params == "latihan_kurang"){
            dataSoal = json.latihan_kurang;
        }else if(params == "latihan_bagi"){
            dataSoal = json.latihan_bagi;
        }else{
            dataSoal = json.session_one;
        }
        let i;
        for(i = 0; i <= dataSoal.length ; i++){
            if(i == 0){
                $("#carouselSlide .carousel-inner").append(`
                <div class="carousel-item active">
                    <div class="soal">
                        ${dataSoal[i].pertanyaan}
                    </div>
                    <div class="jawaban-pilgan">
                         ${dataSoal[i].jawaban[0]}
                         ${dataSoal[i].jawaban[1]}
                         ${dataSoal[i].jawaban[2]}
                         ${dataSoal[i].jawaban[3]}
                    </div>
                </div>`);
            }else{
                $("#carouselSlide .carousel-inner").append(`
                <div class="carousel-item">
                    <div class="soal">
                         ${dataSoal[i].pertanyaan}
                    </div>
                    <div class="jawaban-pilgan">
                        ${dataSoal[i].jawaban[0]}
                        ${dataSoal[i].jawaban[1]}
                        ${dataSoal[i].jawaban[2]}
                        ${dataSoal[i].jawaban[3]}
                    </div>
                </div>`);
            }
        }
    });
   
}
    
