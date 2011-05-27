var Sheet = {};

Sheet.core = {}
Sheet.handlers = {};

Sheet.core.init = function() {
  Sheet.core.select_table();
};

Sheet.core.select_table = function() {
  var table = $('table').css({'border': '1px solid #ff0000'});
  Sheet.handlers.on_select_table($('table')[0]);
};

// for now, it's only 0-26
Sheet.core.index_to_row = function (i) {
  return String.fromCharCode('A'.charCodeAt(0) + i);
};

// for now, it's only A-Z
Sheet.core.row_to_index = function (c) {
  return c.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
};

// initialize a table by giving all the cells classes
Sheet.handlers.on_select_table = function(table) {
  $(table).find('td').live('click', Sheet.handlers.cell_click);
  $(table).find('tr').each(function (y, e) {
    var row = Sheet.core.index_to_row(y);
    var y_class = 'sheet-row-' + row;
    $(this).addClass(y_class);

    $(this).find('td').each(function (x, e) {
      var x_class = 'sheet-column-' + (x + 1);
      $(this).addClass(x_class).addClass(y_class);
      $(this).attr('cellname', row + (x + 1));
    });
  });
  // Add the header and column row
  Sheet.core.add_column_header(table);
};

Sheet.core.add_column_header = function(table) {
  var already_done = $(table).attr('sheet_has_column_header');
  if (typeof already_done == 'undefined') {
    var row_contents = '';
    // need a better way to do this
    var length = $($(table).find('tr')[0]).find('td').length;

    for (var i = 1; i <= length; i++) {
      var column_name = i;
      row_contents += '<td align="center" class="sheet-column-indicator"><strong>' + column_name + '</strong></td>';
    }
    $(table).prepend('<tr>' + row_contents + '</tr>');

    $(table).find('tr').each(function (y, e) {
      if (y > 0) {
        var row_name = String.fromCharCode(64 + y);
      }
      else {
        var row_name = '&nbsp;';
      }
      $(this).prepend('<td class="sheet-row-indicator"><strong>' + row_name + '</strong></td>');

      var tmp = $(this).find('td').length;
      if (tmp > length) {
        length = tmp;
      }
    });
  }
  $(table).attr('sheet_has_column_header', true);
};

Sheet.handlers.cell_click = function() {
  // abort if this isn't an actual cell.. at least for now.
  if (typeof $(this).attr('cellname') == 'undefined') {
    return false;
  }

  var content_text = $(this).text();
  var input_id = 'cell_' + $(this).attr('cellname');

  var selector = '#' + input_id;

  $(this).attr('originalvalue', content_text);
  $(this).html('<input type="text" id="' + input_id + '" value="' + content_text + '" />');

  $(selector).focus();

  $(selector).bind('blur', function (e) {
    var value = $(selector).val();
    $(this).parent().html(value);
  });

  $(selector).bind('click', function () {
    return false;
  });

};

jQuery(document).ready(function($) {
  Sheet.core.init();
  alert($("td[cellname='A1']").text());
});