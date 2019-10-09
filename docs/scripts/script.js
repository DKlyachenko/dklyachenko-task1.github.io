var urlBase = 'https://guarded-fortress-00255.herokuapp.com/invoices';
$(function () {
    getRequest();

    $('.btnReturn').click(function () {
        $('#mainWindow').show();
        $('#editWindow').hide();
        $('#addWindow').hide();
        clearInputs();
        getRequest();
    });

    $('#addNew').click(function () {
        $('#mainWindow').hide();
        $('#editWindow').hide();
        $('#addWindow').show();
    });

    $('#orderField').change(function () {
        if ($(this).val() !== '') {
            $('#orderValue').show();
        }
        else {
            $('#orderValue').hide();
        }
    });

    $('#filterField').change(function () {
        if ($(this).val() !== '') {
            $('#filterValue').show();
        }
        else {
            $('#filterValue').hide();
            $('#filterValue').val('');
        }
    });

    $('#searchBtn').click(function () {
        var filterField = $('#filterField').val();
        var searchValue = $('#searchValue').val();
        data = {
            _sort: $('#orderField').val(),
            _order: $('#orderValue').val()
        }
        if (filterField !== ''){
            data[filterField] = $('#filterValue').val();}
        if (searchValue !== ''){
            data['q'] = searchValue;
        }
        
        $.ajax({
            url: urlBase,
            data: data,
            success: fill
        });
    });


    $('#btnCreate').click(function () {
        var number = $('#addWindow #number').val();
        var supplyDate = $('#addWindow #supplyDate').val();
        var dueDate = $('#addWindow #dueDate').val();
        var comment = $('#addWindow #comment').val();
        var now = new Date();
        var dateCreated = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;
        const direction =()=>'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,(c,r)=>('x'==c?(r=Math.random()*16|0):(r&0x3|0x8)).toString(16));


        var obj = {
            number: number,
            date_supply: supplyDate,
            date_due: dueDate,
            comment: comment,
            date_created: dateCreated,
            direction: direction
        }

        $.ajax({
            url: urlBase,
            type: 'POST',
            data: obj,
            success: () => { alert('Success'); clearInputs() }
        });
    });

    $('#btnUpdate').click(function () {
        var number = $('#editWindow #number').val();
        var supplyDate = $('#editWindow #supplyDate').val();
        var dueDate = $('#editWindow #dueDate').val();
        var comment = $('#editWindow #comment').val();
        var id = $('#editWindow #editId').val();
        var createDate = $('#editWindow #createDate').val();


        var obj = {
            number: number,
            date_supply: supplyDate,
            date_due: dueDate,
            comment: comment,
            date_created: createDate
        }

        $.ajax({
            url: `${urlBase}/${id}`,
            type: 'PUT',
            data: obj,
            success: () => { alert('Success');}
        });
    });

    function getRequest() {
        $.ajax({
            url: urlBase,
            success: fill
        });
    }


    function fill(data) {
        $('#myTable tbody tr').remove();
        data.forEach(element => {
            var editButton = '<button class = "btn btn-success btnEdit">Edit</button>';
            var deleteButton = '<button class = "btn btn-danger btnDelete">Delete</button>';
            var buttons = `<div id = ${element.id}>${editButton}${deleteButton}</div>`;
            var tableLine = `<tr>
            <td>${element.date_created}</td>
            <td>${element.number}</td>
            <td>${element.date_supply}</td>
            <td>${element.date_due}</td>
            <td>${element.comment}</td>
            <td>${buttons}</td>
            </tr>`;
            $('#myTable').append(tableLine);
        });

        $('.btnDelete').click(function () {
            var deleteConfirm = confirm("Are you sure you want to delete selected invoice?");
            if (!deleteConfirm){
                return;
            }
            var id = $(this).parent().attr('id');
            $.ajax({
                url: `${urlBase}/${id}`,
                type: 'DELETE',
                success: getRequest
            });
        });

        $('.btnEdit').click(function () {
            var id = $(this).parent().attr('id');
            $.ajax({
                url: `${urlBase}/${id}`,
                type: 'GET',
                success: edit
            });
            $('#mainWindow').hide();
            $('#editWindow').show();
        })
    };


    function edit(data) {
        $('#editWindow #number').val(data.number);
        $('#editWindow #supplyDate').val(data.date_supply);
        $('#editWindow #dueDate').val(data.date_due);
        $('#editWindow #comment').val(data.comment);
        $('#editWindow #editId').val(data.id);
        $('#editWindow #createDate').val(data.date_created);
    }

    function clearInputs() {
        $('#addWindow #number').val('');
        $('#addWindow #supplyDate').val('');
        $('#addWindow #dueDate').val('');
        $('#addWindow #comment').val('');
    }


});
