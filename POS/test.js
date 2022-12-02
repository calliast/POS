const addItem = (invoice, itemcode, qty) => {
  $.post(`http://localhost:3023/purchases/invoice`, { invoice, itemcode, qty })
    .done(function (response) {
      // Reset form $('#invoice-form').trigger('reset')
      // Toggle back and reload table
      $("#dataInvoice").DataTable().clear().ajax.reload();
    })
    .fail(function (err) {
      console.log(err);
      alert("gagal pake jquery");
    });
};
