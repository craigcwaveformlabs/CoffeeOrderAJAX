$(document).ready(function() {

  // search for section with id 'orders'
  var $orders = $('#orders');
  var $name = $('#name');
  var $drink = $('#drink');


  //mustache template - grab from the html script
  var orderTemplate = $('#order-template').html();

  // function to add order html, using mustache template
  function addOrder(order) {
    $orders.append(Mustache.render(orderTemplate, order));
  }

  // GET database elements and populate html elements
  $.ajax({
    type: 'GET',
    url: 'http://rest.learncode.academy/api/youthis/orders',
    success: function(orders) {
      $.each(orders, function(i, order){
        // for each order in the DataBase, add a new line to the section
        addOrder(order);
      });
    },
    error: function() {
      alert('error loading orders');
    }
  }); //END of get method

  // POST a new order from click event in html
  $('#add-order').on('click', function() {
    var order = {
      name: $name.val(),
      drink: $drink.val()
    };

    $.ajax({
      type: 'POST',
      url: 'http://rest.learncode.academy/api/youthis/orders',
      data: order,
      success: function(data) {
          addOrder(data);
      },
      error: function() {
        alert('error saving order');
      }
    });
  }); //END of post method


  // DELETE an order on button press
  $orders.delegate('.remove', 'click', function() {
    // find li of clicked button
    var $li = $(this).closest('li');

    $.ajax({
      type: 'DELETE',
      url: 'http://rest.learncode.academy/api/youthis/orders/' + $(this).attr('data-id'),
      success: function() {
        $li.fadeOut(300, function(){
          $(this).remove();
        });
      }
    });
  }); //END of delete method


  //Edit button
  $orders.delegate('.editOrder', 'click', function() {
    // find li of clicked button
    var $li = $(this).closest('li');
    // add the existing text of name and drink into the input boxes
    $li.find('input.name').val( $li.find('span.name').html() );
    $li.find('input.drink').val( $li.find('span.drink').html() );
    // add the edit class to the selected li
    $li.addClass('edit');
  });//END of edit button method

  //Cancel Edit button
  $orders.delegate('.cancelEdit', 'click', function() {
    // remove edit class from li
    $(this).closest('li').removeClass('edit');
  });//END of cancel button method

  //Save Edit button
  $orders.delegate('.saveEdit', 'click', function() {
    // remove edit class from li
    var $li = $(this).closest('li').removeClass('edit');
    //build edited order
    var order = {
      name: $li.find('input.name').val(),
      drink: $li.find('input.drink').val()
    };
    //PUT edited order into the database
    $.ajax({
      type: 'PUT',
      data: order,
      url: 'http://rest.learncode.academy/api/youthis/orders/' + $li.attr('data-id'),
      success: function() {
        $li.find('span.name').html(order.name);
        $li.find('span.drink').html(order.drink);
        $li.removeClass('edit');
      },
      error: function() {
        alert('Error saving edited order');
      }
    });
  });//END of save edit method



});
