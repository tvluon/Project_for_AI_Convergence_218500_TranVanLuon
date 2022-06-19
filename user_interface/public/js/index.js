import { handleFilterUI } from "./filter.js"
import { handleCountdownTimerUI } from "./timer.js"
import { handleTagTrigger } from "./tag.js"
import { onQuerySuccess } from "./query.js"

var sleep = function (ms) {  
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

var sendQuery = function (query) {
    $('.loader-wrapper').removeClass('custom-hidden');

    $.post("http://localhost:5000", {'text': query})
        .done(onQuerySuccess)
        .fail((xhr, status, error) => {
            // alert('Query failed!\n');
            console.log(JSON.stringify(xhr));
            console.log(status);
            console.log(error);
            var data = [
                {
                    'id': '000',
                    'defect': 'Non-Defective'
                },
                {
                    'id': '001',
                    'defect': 'Non-Defective'
                },
                {
                    'id': '006',
                    'defect': 'Defective'
                },
                {
                    'id': '009',
                    'defect': 'Defective'
                },
                {
                    'id': '010',
                    'defect': 'Defective'
                },
                {
                    'id': '012',
                    'defect': 'Defective'
                },
                {
                    'id': '018',
                    'defect': 'Defective'
                },
                {
                    'id': '020',
                    'defect': 'Defective'
                }
            ]
            $('.loader-wrapper').addClass('custom-hidden');
            setTimeout(function () { 
                onQuerySuccess(data)
             }, 3000);
            // onQuerySuccess(data);
        });
};

var onSubmitQueryBtnClick = function () { 
    var query = $('header .search-bar input[type="text"]').val();
    $('#tag-holder').html('');
    $('.result-holder').html('');
    $('.date-picker>input[type="date"]').val('');
    $('.time-picker>input[type="time"]').val('');
    $('.date-select-picker>select').val('any');
    $('input[type="checkbox"]:checked').trigger('click');
    $('#text-value-holder').html('');
    $('header .search-bar input[type="file"]').trigger('click');
    sendQuery(query);
 }

 function downloadImage(url) {
    fetch(url, {
      mode : 'no-cors',
    })
      .then(response => response.blob())
      .then(blob => {
      let blobUrl = window.URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.download = url.replace(/^.*[\\\/]/, '');
      a.href = blobUrl;
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
  }

$(document).ready(async function () {
    handleFilterUI();

    handleCountdownTimerUI();

    handleTagTrigger();

    $('header .search-bar i:last').click(onSubmitQueryBtnClick);

    $('header .search-bar input[type="text"]').keyup(function (e) {
        if (e.keyCode == 13) {
            onSubmitQueryBtnClick();
        }
    });
    // $('header .search-bar input[type="file"]').on('change', function () {
    //     var formData = new FormData();
    //     formData.append('sample', $(this).prop('files')[0])
    //     $('.loader-wrapper').removeClass('custom-hidden');
    //     $.ajax({
    //         type: "POST",
    //         url: "http://localhost:5000",
    //         data: formData,
    //         processData: false,
    //         contentType: false,
    //         success: onQuerySuccess,
    //         error: function (xhr, status, error) {
    //             $('.loader-wrapper').addClass('custom-hidden');
    //             alert('Queru failed!');
    //             console.log(JSON.stringify(xhr));
    //             console.log(status);
    //             console.log(error);
    //         }
    //     });
    // });

    // $('header .search-bar i:first').click(function () {
    //     $('header .search-bar input[type="file"]').trigger('click');
    // });

    $('#result-detail-modal').on('hide.bs.modal', function(){
        $(this).removeClass('d-flex');
    });

    $('#modal-submit-btn').click(function(){
        // var resultId = $('#result-detail-holder>div:first').data('result-id');
        // window.open(`https://vbs.itec.aau.at:9443/submit?item=${resultId}`, '_blank');
        // download($('#result-detail-holder img').attr('src'), "result.png","image/png");
        downloadImage($('#result-detail-holder img').attr('src'))
    });
});