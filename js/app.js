/*

1. Deferred, promise, then, wait, resolve
2. Prototypes
3. MVC architecture
4. Cordova

*/
(function($) {

    window.ajaxRequests = {};

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

    ajax();

    scopes();

    multiAjax();

    function processor() {

        var section = $('#deferred .output1');

        section.append('Processor <br /><br />');
        section.append('waiting...');

        var timer;

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

        var section = $('#deferred .output2');
        section.append('Init App <br /><br />');

        var loggedIn = $.Deferred();
        var databaseReady = $.Deferred(); //deferred

        loggedIn.fail(function(){
            section.append('<span class="error">(Fail) Couldn\'t log in </span><br />');
        });
        databaseReady.fail(function(){
            section.append('<span class="error">(Fail) Couldn\'t init DB </span><br />');
        });

        section.append('Logging in... <br />');
        loggedIn.resolve();
        
        setTimeout(function(){
            section.append('DB initialising... <br />');
            databaseReady.resolve();
        }, 1500);

        $.when(loggedIn, databaseReady).then(function() {
            section.append('(Then) Logged in and database ready - loading app...<br />');
        }).always(function(){
            section.append('(Always) Browser session updated...<br />');
        }).fail(function(){
            section.append('<span class="error">(Fail) Problem logging in and/or setting up database.</span> <br />')
        });
    }

    function steps() {

        var section = $('#deferred .output3');
        section.append('Steps <br /><br />');

        $.when(step1, step2, step3).then(function(){
            section.append("All done.");
        });

        var step1 = $.Deferred();
        var step2 = $.Deferred();
        var step3 = $.Deferred();

        step1.done(function() { 
            section.append("Step 1 <br />") 
        });
        step2.done(function() { 
            section.append("Step 2 <br />") 
        });
        step3.done(function() { 
            section.append("Step 3 <br />") 
        });

        //now the 3 alerts will also be fired in order of 1,2,3
        //no matter which Deferred gets resolved first.

        step2.resolve();
        step3.resolve();
        step1.resolve();   

    }

    /*
        Cached ajax response and chained functions
    */
    function ajax() {

        var section = $('#deferred .output4');
        section.append('Cached AJAX requests <br /><br />');

        console.log(ajaxRequests['date']);

        if(!ajaxRequests['date']){
            section.append("<span class='info'>Requesting date & time from server...</span><br />");
            ajaxRequests['date'] = $.ajax({
                url: 'http://date.jsontest.com/',
                dataType: 'jsonp',
                timeout: 15000
            });
        } else {
            section.append("<span class='info'>Loading cached response for date & time</span><br />");
        }

        console.log(ajaxRequests);
        
        // Cached response available
        ajaxRequests['date'].done(success).fail(error).always(complete);

        function success(data){
            section.append(data.time+"<br />"+data.date+"<br />");
            section.append('Done <br />');
        }
        function error(){
            section.append('Fail <br />');
        }
        function complete(){
            section.append('Always <br />');
        }                
    }

    function scopes(){

        var section = $('#deferred .output5');
        section.append('Scopes <br /><br />');

        var myVar;
        setTimeout(function(){
            myVar = 'myVar';
            section.append(myVar + " in the timeout - can be accessed <br />");
            // end up writing lots of nested code in here
        }, 2000);

        // how to access this value if it is set in the future?
        section.append(myVar + " - can\'t be accessed yet <br />");

        // we can use a deferred object

        var myVar2;
        var setVal = function() {

            // upon creation, deferred's status is 'pending'
            var deferred = $.Deferred();

            setTimeout(function(){
                myVar2 = 'myVar2';
                // once it resolves, any callbacks attached to it
                // will fire
                deferred.resolve();
            }, 2000);

            // return a limited version of the deferred
            // The promise says "I promise to let setVal() know when 'deferred'  
            // is resolved"
            return deferred.promise();
        }

        setVal().done(function(){
            section.append(myVar2 + " - setVal() done<br />");
        }).fail(function(){
            section.append(myVar2 + " - setVal() fail<br />");            
        });

        // alternatively can use then (success, fail)
        setVal().then(function(){
            section.append(myVar2 + " - setVal() done<br />");
        }, function(){
            section.append(myVar2 + " - setVal() fail<br />");            
        });

    }

    function multiAjax(){

        var section = $('#deferred .output6');
        section.append('Multiple AJAX requests <br /><br />');
        section.append('Requesting the time until the minute is up...<br />');

        var timer;

        $.getTime = function(){
            
            var dfd = $.Deferred();

            timer = setInterval(function(){
                $.ajax({
                    url: 'http://date.jsontest.com/',
                    dataType: 'jsonp',
                    success: dfd.notify
                });
            }, 1000);

            return dfd;
        }

        var request = $.getTime();

        request.progress(function(data){
            var seconds = parseInt(data.time.split(':')[2].split(' ')[0]);

            if(seconds === 0){
                clearInterval(timer);
                request.resolve();
            } else {
                section.append(seconds+' ');
            }

        });

        request.done(function(){
            section.append('Done<br />');
        })
        .fail(function(){
            section.append('Fail<br />');
        })
        .then(function(){
            section.append('Then<br />');
        });

    }

};










