$('#left-trigger').click(function(){
  chooseFileLeft('#fileDialogLeft');
});

$('#right-trigger').click(function(){
  chooseFileRight('#fileDialogRight');
});

  function chooseFileLeft(name) {
    var chooser = $(name);
    chooser.unbind('change');
    chooser.change(function(evt) {
      var files = $('#fileDialogLeft')[0].files;
		for (var i = 0; i < files.length; ++i){
			console.log(files[i].name);
  			$('#left-file-pool').append(`<a href="${files[i].path}">${files[i].name}</a>`);
		}
    });

    chooser.trigger('click');  
  }

  function chooseFileRight(name) {
    var chooser = $(name);
    chooser.unbind('change');
    chooser.change(function(evt) {
      var files = $('#fileDialogRight')[0].files;
    for (var i = 0; i < files.length; ++i){
      console.log(files[i].name);
        $('#right-file-pool').append(`<a href="${files[i].path}">${files[i].name}</a>`);
    }
    });

    chooser.trigger('click');  
  }
 