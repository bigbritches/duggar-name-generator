$(document).ready(function() {
	
	if($(window).width() < 768) {
	    $('h1 .large_text').fitText();
	}
	
	/*if($(window).width() > 767) {
        $('#dng_screen2 h2, #dng_screen2 h3').fitText();
    }*/
	
	//DISABLE DUGGARIZE IT BTN IF INPUT IS EMPTY
	checkForName();
	
	$('#dng_form #first_name').on('keyup', function() {
	    checkForName();
	});
	
	$('#dng_form #first_name').on('keydown', function(e) {
        // Ignore controls such as backspace
        var arr = [8,16,17,20,32,35,36,37,38,39,40,45,46,189];

        // Allow letters
        for(var i = 65; i <= 90; i++){
            arr.push(i);
        }
        

        if(jQuery.inArray(e.which, arr) === -1){
            e.preventDefault();
        }
    });

    $('#dng_form #first_name').on('input', function() {
        //var regexp = /[^a-zA-Z]/g;
        var regexp= /[- a-zA-Z]/g;
        if(!$(this).val().match(regexp)){
            $(this).val( $(this).val().replace(regexp,'') );
        }
    });
	
	//NAME GENERATE AJAX
	$('#dng_form .dng_btn').on('click', function(e) {
	    e.preventDefault();
	    
	    var sex = $("input:radio[name ='sex']:checked").val(),
	        first_name = $('#first_name').val(),
	        json_path = 'elements/js/jnames.json',
	        namePool = [],
	        t = $('#dng_generated_name'),
	        naughty = false;
	    
	    //SWEAR FILTER
        var swearWords = ['fuck', 'shit', 'damn', 'cunt', 'nigger', 'ass', 'cock', 'bitch', 'fag'];
                
        for(i = 0; i < swearWords.length; i++) {
            if( swearWords[i].toUpperCase() === first_name.toUpperCase() || (first_name.toUpperCase().indexOf(swearWords[i].toUpperCase()) >= 0) ) {
                naughty = true;
            }
        };
        
        if( naughty ) {
            
            //NAUGHTY WORD!!
            $('#dng_screen1 #first_name').val('');
            $('#dng_form .dng_btn').attr('disabled', 'disabled');
            return false;
            
        } else {
	    
            if( first_name.substr(0,1).toUpperCase() == 'J' ) {
                //console.log('STARTS WITH A J: ' + fn);
                var node = sex + '_middle',
                    is_J = true;
        
            } else {
                //console.log('NO J: ' + fn);
                var node = sex,
                    is_J = false;
            }
            
            //fade out screen1, fade in screen2 on Ajax success
            $('#dng_screen1').fadeOut(function() {
            
                $.ajax({
                    url: json_path,
                    dataType: 'json',
                    success: function(data) {
                
                        $.each(data, function(entryIndex, entry) {
                            namePool = entry[node];
                        });
                
                        //console.dir(namePool);
                
                        //grab a random name from the pool
                        var randNum = Math.floor(Math.random()*namePool.length),
                            theName = namePool[randNum],
                            n1,
                            n2;
                                
                        //Return the name
                        if( is_J ) {
                            n1 = capIt(first_name);
                            n2 = capIt(theName);
                    
                            t.text(n1 + ' ' + n2 + ' Duggar');
                        } else {
                            n1 = capIt(theName);
                            n2 = capIt(first_name);
                    
                            t.text(n1 + ' ' + n2 + ' Duggar');
                        }
                        
                        $('#dng_screen2').css('opacity', '0').show();
                        $('#dng_generated_name').fitText();
                        $('#dng_screen2').animate({
                            opacity : 1
                        }, 300);
                        
                    },
                    error: function(xhr, ajaxOptions, thrownError) {
                        console.log(xhr.status);
                        console.log(thrownError);
                    }
                });
            
            
                
            
            });
        }
	    
	});
	
	//GET ANOTHER
	$('#dng_regenerate').on('click', function(e) {
	    e.preventDefault();
	    
	    //reset screens, clear inputs, run the disable fn again
	    $('#dng_screen2').fadeOut(function() {
	        
	        $('#dng_screen1').css('opacity', '0').show();
	        checkForName();
	        $('#dng_screen1 #first_name').val('');
	        $('#dng_screen1').animate({
	            opacity : 1
	        }, 300);
	        
	        
	    });
	});
	
	//SOCIAL SHARING
	$('.social.facebook').on('click', function(e) {
	    e.preventDefault();
	    var share_link = 'http://bigbritches.webfactional.com/discovery/dng/';
	    var facebook_url = encodeURI('https://www.facebook.com/dialog/feed?app_id=1561657267448009&display=popup&caption=Test Caption&link=' + share_link + '&picture=' + share_link + '&description=Test Description test test lorem ipsum&redirect_uri=' + share_link);
	    
	    window.open(facebook_url,'','width=580,height=400');
	});
	
	$('.social.twitter').on('click', function(e) {
	    e.preventDefault();
	    
	    var tweet_text = encodeURI('This is the text of my custom tweet lorem ipsum dolor sit amet'),
	        share_link = 'http://bigbritches.webfactional.com/discovery/dng/',
	        tweet_href = 'https://twitter.com/intent/tweet?text=' + tweet_text + '%20' + share_link;
	    
	    window.open(tweet_href,'','width=580,height=400');
	});
	
});

function checkForName() {
    var empty = false;
    $('#dng_form #first_name').each(function() {
        
        var b = $(this).val();
        
        if (b.length == 0) {
            empty = true;
        }
    });

    if (empty) {
        $('#dng_form .dng_btn').attr('disabled', 'disabled');
    } else {
        $('#dng_form .dng_btn').removeAttr('disabled');
    }
}

function capIt(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}