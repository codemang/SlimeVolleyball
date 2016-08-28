export function getMenuOptions(url, callback) {
  $.ajax({
    url: url,
    type:'GET'
  }).done(callback);
}
