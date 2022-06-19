import { onApplySuccess } from "./query.js"

const attributes = [
    'DAGM',
    'KSDD',
    'KSDD2',
    'STEEL',
    'MVTEC'
];
const concepts = [
    'All',
    'Defective',
    'Non-Defective'
]

var sendApplyFilterQuery = function (listFilter) {
    $('.loader-wrapper').removeClass('custom-hidden');

    $.post("http://localhost:5000/filter", { 'filter[]': listFilter })
        .done(onApplySuccess)
        .fail((xhr, status, error) => {
            $('.loader-wrapper').addClass('custom-hidden');
            alert('Query failed!\n');
            console.log(JSON.stringify(xhr));
            console.log(status);
            console.log(error);
        });
}

var onApplyFilterBtnClick = function () {
    console.log('List filter:');

    var listFilter = [];
    $('#tag-holder span').each(function () {
        var filterData = $(this).data('tag-id');
        // console.log(filterData);
        listFilter.push(filterData)
    });

    $('#text-value-holder>div').each(function () {
        var filterData = $(this).data('tag-id');
        // console.log(filterData);
        listFilter.push(filterData)
    });

    console.log(listFilter);

    if (listFilter.length > 0) {
        sendApplyFilterQuery(listFilter);
    }
}

function handleFilterUI() {
    concepts.forEach(function (concept) {
        let elId = concept.split(' ').join('-')
        let elValue = concept.toLowerCase()
        $('#object-value-holder').append(`
        <div>
            <input type="checkbox" value="${elValue}" id="object-${elId}" data-tag-name="${concept}">
            <label for="object-${elId}">${concept}</label>
        </div>
        `);
    });

    $('#object-value-holder input[type="checkbox"]:first').prop('checked', true)

    $('#object-value-holder input[type="checkbox"]').on('click', function() {
        $('#object-value-holder input[type="checkbox"]').prop('checked', false)
        this.checked = true
     });

    // categories.forEach(function (category) {
    //     let elValue = category.split(' ').join('-')
    //     let elId = elValue.split('/').join('-')
    //     $('#place-value-holder').append(`
    //     <div>
    //         <input type="checkbox" value="place-${elValue}" id="place-${elId}" data-tag-name="${category}">
    //         <label for="place-${elId}">${category}</label>
    //     </div>
    //     `);
    // });

    attributes.forEach(function (attribute) {
        let elId = attribute.split(' ').join('-')
        let elValue = attribute.toLowerCase()
        $('#attribute-value-holder').append(`
        <div>
            <input type="checkbox" value="${elValue}" id="attribute-${elId}" data-tag-name="${attribute}">
            <label for="attribute-${elId}">${attribute}</label>
        </div>
        `);
    });

    $('#attribute-value-holder input[type="checkbox"]:first').prop('checked', true)

    $('#attribute-value-holder input[type="checkbox"]').on('click', function() {
        $('#attribute-value-holder input[type="checkbox"]').prop('checked', false)
        $(this).prop('checked',true)
     });

    var applyFilterBtn = $("#apply-filter-btn");
    applyFilterBtn.click(onApplyFilterBtnClick);

    $('#text-filter-input').keyup(function (e) {
        if (e.keyCode == 13) {
            var textValue = $(this).val()
            $('#text-value-holder').append(`
            <div class="bg-light border mb-1 px-2 d-flex justify-content-between align-items-center" data-tag-id="text-location-${textValue.toLowerCase().split(' ').join('-')}">
                <span>${textValue}</span>
                <i class="fa fa-times" aria-hidden="true"></i>
            </div>
            `);
            $('#text-value-holder>div:last').click(function () {
                $(this).remove();
            });
            $(this).val('')
        }
    });

    $('.filter-search').keyup(function(e) {
        $(this).parent().parent().find('.value-holder>div').removeClass('custom-hidden');
        var keyword = $(this).val();
        if (keyword == '') {
            return;
        }
        // console.log(keyword);
        $(this).parent().parent().find('.value-holder>div').each(function() {
            var tag = $(this).children('label').text()
            // console.log(tag);
            if (!tag.includes(keyword)) {
                $(this).addClass('custom-hidden');
            }
        });
    });
}

export { handleFilterUI }