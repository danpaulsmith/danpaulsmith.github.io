/*

1. Deferred, promise, then, wait, resolve
2. Prototypes
3. MVC architecture
4. Cordova

*/
(function($) {
    
    $('h2 a.show-source').click(function(){
        var section = $(this).closest('section');
        $.ajax({url:$(this).attr('rel')}).done(function(data){
            section.find('.source').html(data).slideDown();
        });
    });

    deferred();

    prototypes();

})(jQuery);


function deferred() {

    processor();

    initApp();

    steps();

    function processor() {

        var timer;

        var section = $('#deferred .output1');
        section.html('waiting...');

        var promise = process();

        promise.always(function(){
        	section.append('always.');
        });
        promise.done(function(){
        	section.append('done.');
        });
        promise.fail(function(){
        	section.append('fail.');
        });
        promise.progress(function(){
        	section.append(".");
        });
        promise.state(function(){
        	section.append('state.');
        });
        promise.then(function(){
        	section.append('then.');
        });
        

        function process() {
        	
        	var deferred = $.Deferred();

        	//console.log(deferred.state());

        	timer = setInterval(function(){
        		deferred.notify();
        	}, 1000);

        	setTimeout(function(){
        		clearInterval(timer);
        		deferred.resolve();
        	}, 3000);


        	return deferred;
        };
    }

    function initApp(){

        var section2 = $('#deferred .output2');

    	var loggedIn = $.Deferred();
		var databaseReady = $.Deferred(); //deferred

		loggedIn.fail(function(){
			section2.append('<span class="error">Couldn\'t log in </span><br />');
		});
		databaseReady.fail(function(){
			section2.append('<span class="error">Couldn\'t init DB </span><br />');
		});

		setTimeout(function(){
    		section2.append('Logging in... <br />');
    		loggedIn.resolve();
    	}, 2000);

		setTimeout(function(){
    		section2.append('DB initialising... <br />');
    		databaseReady.reject();
    	}, 5000);

		$.when(loggedIn, databaseReady).then(function() {
			section2.append('Logged in and database ready. <br />');
		}).always(function(){
			section2.append('Clear app cache <br />');
		}).fail(function(){
			section2.append('<span class="error">Problem logging in and/or setting up database.</span> <br />')
		});
    }

    function steps() {

        var section3 = $('#deferred .output3');

        var step1 = $.Deferred();
        var step2 = $.Deferred().done(function() { return step1 });
        var step3 = $.Deferred().done(function() { return step2 });

        step1.done(function() { section3.append("Step 1 <br />") });
        step2.done(function() { section3.append("Step 2 <br />") });
        step3.done(function() { section3.append("Step 3 <br />") });
        //now the 3 alerts will also be fired in order of 1,2,3
        //no matter which Deferred gets resolved first.

        step2.resolve();
        step3.resolve();
        step1.resolve();   

    };

};

function prototypes() {

	var section = $('#prototype .output');

	Car.prototype.speed = 50;
	Car.prototype.drive = function(){
		section.append(this.name+" is driving at "+this.speed+" miles an hour <br />");
	};
	function Car(name){
		this.name = name;
	};

	SuperCar.prototype.speed = 200;	
	SuperCar.prototype = new Car();
	function SuperCar(name){
		Car.call(this, name);
	}


	var car1 = new Car('car');
	var car2 = new SuperCar('supercar');

	car1.drive();
	car2.drive();

}
