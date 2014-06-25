/*

1. Deferred, promise, then, wait, resolve
2. Prototypes
3. MVC architecture
4. Cordova

*/
(function($) {
    
    $('h2').click(function(){
        var section = $(this).parent();
        if(section.hasClass('open')){
            section.removeClass('open');
            section.find('.output').empty();
        } else {
            section.addClass('open');
            eval(section.attr('id'))();            
        }
    });
    /*
    $('h2 a.show-source:not(.expanded)').click(function(){
        var section = $(this).closest('section').find('.source').slideDown();
        $(this).addClass('expanded');
    });
    $('h2 a.show-source.expanded').click(function(){
        var section = $(this).closest('section').find('.source').slideUp();
        $(this).removeClass('expanded');        
    })
    */

    

    //prototypes();

})(jQuery);

function prototypes() {

	var section = $('#prototypes .output');
 
    function Car(name){
        this.name = name;
        this.speed = 50;
        this.features = {};
    }
    Car.prototype.drive = function(){
        section.append("The "+this.name+" is driving at "+this.speed+" miles an hour"+(this.features.turbo?" with turbo":"")+""+(this.features.sunroof?" and the sunroof open":"")+". <br />");
    };
    Car.prototype.stop = function(){
        section.append("The "+this.name+" has stopped. <br />");        
    }

    // Create sub-class and extend base class.
    SuperCar.prototype = new Car();
    SuperCar.prototype.constructor = SuperCar;
     
    function SuperCar(name){
        // Call super constructor to copy all properties to the 
        // subclass instance
        Car.call(this, name);
        this.name = name;
        this.speed = 300;
        this.features.turbo = true;
    }

    car1 = new Car('skoda');
    car1.features.sunroof = true;
    
    car2 = new SuperCar( "porsche" );
    car2.features.turbo = false;        // this doesn't work unless we use Car.call(this) inside SuperCar constructor
    
    car3 = new SuperCar( "ferrari" );
    car3.speed = 350;
       
    car1.drive();
    car2.drive();
    car3.drive();   

    car1.stop();
    car2.stop();
    car3.stop(); 

    // Log updated property profiles.
    console.log( car1 );
    console.log( car2 );
    console.log( car3 );

}



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

