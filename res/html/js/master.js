// JavaScript Document
var cardsFlag = false;

var articleHTML;
var kblinks;
$('#error').hide();
//config:
/*------------ Local variable ------------------*/
var debug = true;
//console.log(location + ' ' + '   master location');
var browserSupportsSpeech = false;
var wants_speech = false;

var systemUtteranceContent;
var userUtteranceContent;

$.get('js/articleHTML.html',function(data) {
					//console.log("article html data: ",data);
					articleHTML = data;
					//var posts = $(data).filter('#posts');
					//$('#container').append(posts);
});
$.get('js/kblinks.json',function(data) {
					
					kblinks = data;
					//var posts = $(data).filter('#posts');
					//$('#container').append(posts);
});
				
/*-------------------------- On Submit Function Click and Enter Start --------------------------*/
//$("#btnSubmit").click(function () {
$(document).on('click', ".btn-send", function () {
    /*-----------Card check start --------------*/
    if ($('.card-1').is(":visible")) {
        //if ($('.card-1').is(":visible") && $('.card-1 .form-control').val() != '') {
        if ($("#userUtterance").val() == '') {
            getInteractiveCardValueNSend();

        } else {
            //alert('utterance is not null');
            submit($("#userUtterance").val(), $("#userUtterance").val());
        }

    } else if (!$('.card-1').is(":visible") && $("#userUtterance").val() !== '') {
        submit($("#userUtterance").val(), $("#userUtterance").val());
    }
});
//enter
$('#userUtterance').keydown(function (e) {
    if (e.keyCode == 13) {
        submit($("#userUtterance").val(), $("#userUtterance").val());
    }
});

/*------------------------------ card form field on enter key call function started ------------*/
/// card form field on enter key call function
$(document).on('keydown', '.card-1 .form-control', function (e) {
    if (e.keyCode == 13) {
        // alert('enter key pressed');
        if ($('.card-1').is(":visible")) {
            //if ($('.card-1').is(":visible") && $('.card-1 .form-control').val() != '') {
            if ($("#userUtterance").val() == '') {
                getInteractiveCardValueNSend();

            } else {
                // alert('utterance is not null');
                submit($("#userUtterance").val(), $("#userUtterance").val());
            }

        }
    }

});
/*------------------------------ card form field on enter key call function End ------------*/

/*--------------- Get Interactive card value function ----------*/
function getInteractiveCardValueNSend() {

    var myThisVal = '';
    var myTextAreaVal = '';
    $(".card-1 .form-control").each(function () {
        if ($('.card-1 .form-control').val() !== '') {

            /*-------- Check entity type and send value accordingly Start-------------*/
            var thisValue = $(this).val();

            if ($(this).val() !== '' && $(this).attr("data-entity-type") === "sys.location.city") {
                var thisValue = "city:" + $(this).val() + ";";
            } else if ($(this).val() !== '' && $(this).attr("data-entity-type") === "sys.person") {
                var thisValue = "person:" + $(this).val() + ";";
            } else if ($(this).val() !== '' && $(this).attr("data-entity-type") === "sys.person.firstname") {
                var thisValue = "firstName:" + $(this).val() + ";";
            } else if ($(this).val() !== '' && $(this).attr("data-entity-type") === "sys.person.lastname") {
                var thisValue = "lastName:" + $(this).val() + ";";
            } else if ($(this).val() !== '' && $(this).attr("data-entity-type") === "sys.organization") {
                var thisValue = "organization:" + $(this).val() + ";";
            } else {
                //alert('esle..')
                if ($(this).val() !== '') {
                    var thisValue = $(this).val() + ";";
                }
            }
            /*-------- Check entity type and send value accordingly End-------------*/
            //  var txtArea = true;
            if ($(this).val() !== '' && $(this).parent().parent().prev().find('.form-control').val() == '') {

                $('<div class="alert alert-info"><strong>IMPORTANT:</strong> Please fill out prev. empty field. </div>').prependTo(".card-1").delay(2500).queue(function () {
                    $(this).remove();
                });

                myThisVal = '';
                $(this).parent().parent().prev().find('.form-control').focus();
                return false;
            } else {
                if ($(this).is(':radio')) {
                    if ($(this).is(':checked')) {
                        myThisVal += thisValue + ' ';
                        myTextAreaVal += $(this).val() + ' ';
                    }
                } else if ($(this).is(':checkbox')) {
                    if ($(this).is(':checked')) {
                        myThisVal += thisValue + ' ';
                        myTextAreaVal += $(this).val() + ' ';
                    }
                } else {
                    //alert('form control else')
                    // alert($(this).attr("data-entity-type"));
                    myThisVal += thisValue + ' ';
                    myTextAreaVal += $(this).val() + ' ';
                }
            }
        } else {
            $('<div class="alert alert-info"><strong>IMPORTANT:</strong>  Please ensure the essential fields are filled in.</div>').prependTo(".card-1").delay(3000).queue(function () {
                $(this).remove();
            });
            return false;
        }

    });
    if (myThisVal != '') {
        //console.log(myThisVal);
        $("textarea#userUtterance").val(myTextAreaVal);
        submit(myThisVal, myTextAreaVal);
    }
}
$(document).on('keypress', '.inputError', function () {
    $(this).removeClass('inputError');
});

/*----------- Get Interactive card value function End----------*/

/*-------------------------- On Submit Function Click and Enter End --------------------------*/

/*-------------------------- On Submit Function Call Start  --------------------------*/

var udateAvatar;
updateAvatar = 'img/avatar1.png';
var userUtteranceVal;
var trimUserUtterance = '';
//alert(userUtteranceVal);
function submit(userUtteranceFormVal, userUtteranceTextareaVal) {
    //alert(userUtteranceVal);
    $('#loading-small').show();
    //userUtteranceVal = $("#userUtterance").val();
    //alert(userUtteranceFormVal);
    //console.log(userUtteranceFormVal);
    userUtteranceVal = userUtteranceFormVal;
    //userUtteranceValNew = $("#userUtterance").val();
    userUtteranceValNew = userUtteranceTextareaVal;
    trimUserUtterance = $.trim(userUtteranceVal);

    /*----------- Exit app if bye utterance start---------------*/

    if (trimUserUtterance == "bye" || trimUserUtterance == "bye bye" || trimUserUtterance == "exit" || trimUserUtterance == "thank you bye bye") {
        $('#confirm').modal({
            backdrop: 'static',
            keyboard: false,
            focus: this
        });
        $('#confirm').on('shown.bs.modal', function () {
            //alert('before exit btn..');
            $('#exitApp').focus();
        })
        $(document.body).on('click', '#NoExitApp', function () {
            $("#loading-small").hide();
            $("#userUtterance").val('');
        });
        $(document.body).on('click', '#exitApp', function () {
            $.post(locationInt + '/terminate',
                function (data) {
                    console.log(data + '...Exit app...');
                }
            );
            $(".chat-wrapper, #home-wrapper, #welcome-wrapper").fadeOut("fast");
            $("#login-wrapper").fadeIn();
            $("#username, #password, #userUtterance").val('');
            $("#loading-small").hide();
            location.reload();
        });
    }
    /*----------- Exit app if bye utterance END---------------*/

    /*----------------- Submit Post Call Start--------------------*/
    function submitPostCall() {
        // console.log("step 4...");
        //console.log(userUtteranceVal)
        // console.log(locationInt);
        // alert(userUtteranceVal);
        $.post(locationInt, {
                userUtterance: userUtteranceVal
            }, function (data) {
                //console.log("step 5...");  
                //console.log(data);
                getCurrentTask();
                $('#loading-small').hide();
                // systemUtteranceVal = data.message.chat;
                /*if ($('#selectLanguage').is(':visible') && $("#selectLanguage").val() !== "en" && $("#btnText").hasClass("active")) {
                    var locationLanguageSelection = location1 + "/translateLanguage?sourceLanguage=en&targetLanguage=" + selectLanguageValue + "&sourceText=" + data.result.reply;

                    $.post(locationLanguageSelection, function (data) {
                        //console.log(data);
                        systemUtteranceVal = data.targetText;
                        submitPostCallInner();
                    });
                } else if ($('#select_language').is(':visible') && $("#select_language").val() !== "en-GB") {
                    //console.log(selectLanguageValue);
                    var locationLanguageSelection = location1 + "/translateLanguage?sourceLanguage=en&targetLanguage=" + selectLanguageValue + "&sourceText=" + data.result.reply;
                    //console.log(locationLanguageSelection);
                    $.post(locationLanguageSelection, function (data) {
                        //console.log(data);
                        systemUtteranceVal = data.targetText;
                        submitPostCallInner();
                    });
                } else {*/
                //alert('test..')      
				replyText = data.result.reply;
				replyTextsub = replyText.substring(replyText.indexOf("articleId:"),replyText.lastIndexOf(":"));
				//console.log("Reply Text:"+replyText);
				//console.log("Reply Text Initial:"+replyText.substring(0,replyText.indexOf("articleId:")));
				//console.log("Reply Text After:"+replyText.substring(replyText.lastIndexOf(":")+1));
				
				systemUtteranceVal = replyText.substring(0,replyText.indexOf("articleId:"))+replyText.substring(replyText.lastIndexOf(":")+1);
				//console.log("systemUtteranceVal:"+systemUtteranceVal);
				articleId = replyTextsub.substring(replyTextsub.indexOf(":")+1); 
				//console.log("replyTextsub:"+replyTextsub);
				console.log("articleId:"+articleId);
                //systemUtteranceVal = data.result.reply;
                submitPostCallInner();
                //}

                function submitPostCallInner() {
                    /*-----System Utterance response---------------*/
					console.log("systemUtteranceVal"+systemUtteranceVal);
					if(systemUtteranceVal.indexOf("raise a Ticket") != -1)
						systemUtteranceContentResponse = '<li class="mar-btm systemUtterance"><div class="media-body pad-hor"> <div class="circle-wrapper animated bounceIn"></div><div class="speech more"><p id="systemUtteranceValue">do you want to raise a ticket? <strong><a href="http://myaccount.capita-cs.co.uk/incidents/create?casetype=" target="_blank">Log a Ticket</a></strong></p> <p class="speech-time"><i class="fa fa-clock-o fa-fw"></i>' + currentTime() + '</p></div></div></li>';
					else if(replyText.indexOf("articleId:") == -1)
						systemUtteranceVal.length <= 100?systemUtteranceContentResponse = '<li class="mar-btm systemUtterance"><div class="media-body pad-hor"> <div class="circle-wrapper animated bounceIn"></div><div class="speech more"><p id="systemUtteranceValue">' + systemUtteranceVal + '</p><p class="speech-time"><i class="fa fa-clock-o fa-fw"></i>' + currentTime() + '</p></div></div></li>':systemUtteranceContentResponse = '<li class="mar-btm systemUtterance"><div class="media-body pad-hor"><div class="speech"><div class="more smallChat"> <p id="systemUtteranceValue">' + systemUtteranceVal + '</p> </div><a href="#" class="morelink">Read more...</a><p class="speech-time"><i class="fa fa-clock-o fa-fw"></i>' + currentTime() + '</p></div></div></li>';
					else if(articleId == "" || articleId == undefined)
						systemUtteranceVal.length <= 100?systemUtteranceContentResponse = '<li class="mar-btm systemUtterance"><div class="media-body pad-hor"> <div class="circle-wrapper animated bounceIn"></div><div class="speech more"><p id="systemUtteranceValue">' + systemUtteranceVal + '</p><p class="satisfied"><strong>Are you satisfied with this Answer? Yes/No</strong></p> <p class="speech-time"><i class="fa fa-clock-o fa-fw"></i>' + currentTime() + '</p></div></div></li>':systemUtteranceContentResponse = '<li class="mar-btm systemUtterance"><div class="media-body pad-hor"><div class="speech"><div class="more smallChat"> <p id="systemUtteranceValue">' + systemUtteranceVal + '</p> </div><a href="#" class="morelink">Read more...</a><p class="satisfied"><strong>Are you satisfied with this Answer? Yes/No</strong></p><p class="speech-time"><i class="fa fa-clock-o fa-fw"></i>' + currentTime() + '</p></div></div></li>';
					else if(articleId.length >= 5)
						systemUtteranceVal.length <= 100 ? systemUtteranceContentResponse = '<li class="mar-btm systemUtterance"><div class="media-body pad-hor"> <div class="circle-wrapper animated bounceIn"></div><div class="speech more"> <p id="systemUtteranceValue">' + systemUtteranceVal + '</p> <main class="cd-main-content"><a href="'+kblinks[articleId]+'" target="_blank" class="kblink">Show Knowledge Base Article</a></main><p class="satisfied"><strong>Are you satisfied with this Answer? Yes/No</strong></p><p class="speech-time"><i class="fa fa-clock-o fa-fw"></i>' + currentTime() + '</p> </div></div></li>':systemUtteranceContentResponse = '<li class="mar-btm systemUtterance"><div class="media-body pad-hor"><div class="speech"><div class="more smallChat"> <p id="systemUtteranceValue">' + systemUtteranceVal + '</p><main class="cd-main-content"><a href="'+kblinks[articleId]+'" target="_blank" class="kblink">Show Knowledge Base Article</a></main><p class="satisfied"><strong>Are you satisfied with this Answer? Yes/No</strong></p></div><a href="#" class="morelink">Read more...</a><p class="speech-time"><i class="fa fa-clock-o fa-fw"></i>' + currentTime() + '</p></div></div></li>';
					else
						systemUtteranceVal.length <= 100 ? systemUtteranceContentResponse = '<li class="mar-btm systemUtterance"><div class="media-body pad-hor"> <div class="circle-wrapper animated bounceIn"></div><div class="speech more"> <p id="systemUtteranceValue">' + systemUtteranceVal + '</p> <main class="cd-main-content"><a href="#0" class="cd-btn">Show Attendance Report PDF</a></main><p class="satisfied"><strong>Are you satisfied with this Answer? Yes/No</strong></p><p class="speech-time"><i class="fa fa-clock-o fa-fw"></i>' + currentTime() + '</p> </div></div></li>':systemUtteranceContentResponse = '<li class="mar-btm systemUtterance"><div class="media-body pad-hor"><div class="speech"><div class="more smallChat"> <p id="systemUtteranceValue">' + systemUtteranceVal + '</p><main class="cd-main-content"><a href="#0" class="cd-btn">Show Attendance Report PDF</a></main><p class="satisfied"><strong>Are you satisfied with this Answer? Yes/No</strong></p></div><a href="#" class="morelink">Read more...</a><p class="speech-time"><i class="fa fa-clock-o fa-fw"></i>' + currentTime() + '</p></div></div></li>';
                    /*-----User Utterance response---------------*/
                    userUtteranceContent = '<li class="mar-btm userUtterance"><div class="media-body pad-hor speech-right"><div class="speech"><p id="userUtteranceValue">' + userUtteranceValNew + '</p><p class="speech-time"><i class="fa fa-clock-o fa-fw"></i>' + currentTime() + '</p></div><div class="circle-wrapper animated bounceIn"></div></div></li>';
					
					console.log("userUtteranceContent:"+userUtteranceContent);
                    /*---------------------- Icard Section Start ----------------*/
                    //console.log(data);
                    if (!data.iCard == 0) {
                        //alert('data icard not equal to 0');
                        console.log(data);
                        /*---------------- Card Task list Code Start --------------------*/
                        var iCardDataResponse = '';
                        if (data.iCard.type === "taskList") {
                            //alert('inside task list')
                            // alert('task list');
                            var icardTask = data.iCard.tasks;
                            //console.log(icardTask);
                            //alert(JSON.stringify(icardTask));
                            var taskButtons = '';
                            $.each(icardTask, function (i, objVal) {
                                //alert(JSON.stringify(objVal));
                                taskButtons += '<input type="button" class="btn btn-primary btnCardTask" value="' + objVal.label + '" name="' + objVal.name + '"/>'
                            })
                            iCardDataResponse = '<div class="card-1"><div class="col-xs-12">' + taskButtons + '</div></div>';
                        }
                        /*---------------- Card Task list Code End --------------------*/

                        /*---------------- Card Entity list Code start --------------------*/
                        if (data.iCard.type === "entityList") {
                            // alert('entity list..');
                            var icardEntities = data.iCard.entities;
                            //var entitiesFormData = '';
                            var entitiesFormFields = '';
                            /*-------------- Entities for each loop start -------------*/
                            $.each(icardEntities, function (i, objVal) {
                                //alert(JSON.stringify(objVal));
                                var formTypeElement = '';
                                var isActive = "";
                                /*------------- Check if field is active or not Start ---------------*/
                                if (objVal.isActive === "true") {
                                    var isActive = 'active'
                                } else {
                                    var isActive = ''
                                }
                                /*------------- Check if field is active or not End ----------------*/
                                /*------------- Check if field type is text Start----------------*/
                                if (objVal.type === "text") {
                                    if (objVal.entityType == "sys.opentext") {
                                        formTypeElement = '<textarea  class="form-control ' + isActive + '" id="' + objVal.name + '" ' + isActive + ' value="' + objVal.value + '" data-entity-type="' + objVal.entityType + '">' + objVal.value + '</textarea>'
                                    } else {
                                        // alert('else');
                                        formTypeElement = '<input type="text" class="form-control ' + isActive + '" id="' + objVal.name + '" value="' + objVal.value + '" data-entity-type="' + objVal.entityType + '">'
                                    }
                                }
                                /*------------- Check if field type is text End----------------*/
                                /*------------- Check if field type is Open Text Start----------------*/
                                /* else if (objVal.type === "text" &&  objVal.entityType == "sys.opentext") {
                                     formTypeElement = '<textarea  class="form-control ' + isActive + '" id="' + objVal.name + '" ' + isActive + ' value="' + objVal.value + '" data-entity-type="' + objVal.entityType + '"> ' + objVal.value + ' </textarea>'
                                 }*/
                                /*------------- Check if field type is Open Text End----------------*/
                                /*------------- Check if field type is Number Start----------------*/
                                else if (objVal.type === "number") {
                                    formTypeElement = '<input type="number" class="form-control ' + isActive + '" id="' + objVal.name + '" ' + isActive + ' value="' + objVal.value + '" data-entity-type="' + objVal.entityType + '">'
                                }
                                /*------------- Check if field type is Number End----------------*/
                                /*------------- Check if field type is List Start----------------*/
                                else if (objVal.type === "list") {
                                    var listValue = objVal.value;
                                    var arrayListVal = listValue.split(',');
                                    var createListOption = '';
                                    $.each(arrayListVal, function (i, arrListVal) {
                                        //alert(arrListVal);
                                        createListOption += '<option value="' + arrListVal + '">' + arrListVal + '</option>'
                                    });
                                    formTypeElement = '<select id="' + objVal.name + '" class="form-control ' + isActive + '" data-entity-type="' + objVal.entityType + '">' + createListOption + '</select>'
                                }
                                /*------------- Check if field type is List End----------------*/
                                /*------------- Check if field type is Date Start----------------*/
                                else if (objVal.type === "date") {
                                    formTypeElement = '<input type="text" class="form-control datepicker ' + isActive + '" id="' + objVal.name + '" ' + isActive + ' value="' + objVal.value + '" data-entity-type="' + objVal.entityType + '">'
                                }
                                /*------------- Check if field type is Date End----------------*/
                                /*------------- Check if field type is Time Start----------------*/
                                else if (objVal.type === "time") {
                                    formTypeElement = '<input type="text" class="form-control timepicker ' + isActive + '" id="' + objVal.name + '"  value="' + objVal.value + '" data-entity-type="' + objVal.entityType + '">'
                                    // $('.timepicker').wickedpicker();
                                    $('.timepicker').wickedpicker('time', 0);

                                }
                                /*------------- Check if field type is Time End----------------*/
                                /*------------- Check if field type is Radio Start----------------*/
                                else if (objVal.type === "radio") {
                                    var radioValue = objVal.value;
                                    var arrayRadioVal = radioValue.split(',');
                                    var createRadioOption = '';
                                    $.each(arrayRadioVal, function (i, arrRadioVal) {
                                        createRadioOption += '<div class="radio radio-info radio-inline"><input type="radio" id="my-' + i + '" value="' + arrRadioVal + '" name="' + objVal.name + '" class="form-control ' + isActive + '" data-entity-type="' + objVal.entityType + '"><label for="my-' + i + '"> ' + arrRadioVal + ' </label></div>'
                                    });

                                    formTypeElement = '<div class="mode-radio-wrap" id="">' + createRadioOption + '</div>'

                                }
                                /*------------- Check if field type is Radio End----------------*/
                                /*------------- Check if field type is Checkbox Start----------------*/
                                else if (objVal.type === "checkbox") {
                                    var checkboxValue = objVal.value;
                                    var arrayCheckVal = checkboxValue.split(',');
                                    var createCheckOption = '';
                                    $.each(arrayCheckVal, function (i, arrCheckVal) {
                                        createCheckOption += '<div class="checkbox"><label><input type="checkbox" value="' + arrCheckVal + '" name="' + objVal.name + '" class="' + isActive + '" data-entity-type="' + objVal.entityType + '">' + arrCheckVal + '</label></div>'
                                    });

                                    formTypeElement = '<div class="checkbox-wrapper">' + createCheckOption + '</div>'
                                }
                                /*------------- Check if field type is Checkbox End----------------*/


                                /*------ check if card is visible or not Start-------------*/
                                if (objVal.isVisible !== "true") {
                                    var isVisible = ' inVisible';
                                } else {
                                    var isVisible = '';
                                }
                                /*------ check if card is visible or not  End-------------*/

                                entitiesFormFields += '<div id="' + objVal.id + '" class="card-row' + isVisible + '"><div class="col-xs-5 clearLeft"><label >' + objVal.label + '</label></div><div class="col-xs-7">' + formTypeElement + '</div></div>'


                            });
                            /*-------------- Entities for each loop End -------------*/
                            var entitiesFormData = '<li class="card-1">' + entitiesFormFields + '<span class="clearfix"></span><div class="card-row card-btn-holder"><div class="col-xs-5"></div><div class="col-xs-7"><input type="button" class="btn btn-primary btn-send" value="Send" name=""/><input type="button" class="btn btn-primary btnCardTask" value="Cancel" name="cancelTask"></div></div></li>'

                        }
                        /*---------------- Card Entity list Code End --------------------*/
                    } else {
                        //console.log('data card is 0 or empty');
                    }

                    /*---------------------- Icard Section End ----------------*/

                    /*---------- info Section Start ----------------*/
                    if (!data.message == 0) {
                        /*infoSystemResponseText = '<div class="info-content-success"><div class="message">' + data.message.data.info.text + '</div></div><a href="#." class="readMore">Read More</a>'
                        errorSystemResponseText = '<div class="info-content-error"><div class="message">' + data.message.data.info.text + '</div></div>'

                        if (!data.message.data.info == 0) {
                            // --------- Info Content ------------ //
                            if (!data.message.data.info.text == 0) {
                                $('#info-wrapper .info-content').html(infoSystemResponseText).fadeIn(600);

                                $('.readMore').magnificPopup({
                                    items: {
                                        src: '<div class="white-popup">' + data.message.data.info.text + '</div>',
                                        type: 'inline'
                                    },
                                    closeBtnInside: true
                                });
                            }
                            // --------- Info Video ------------ //
                            if (!data.message.data.info.video == 0) {
                                $('#info-wrapper .info-video').html(data.message.data.info.video).fadeIn(600);
                            }
                            // --------- Info Image ----------------- //
                            if (!data.message.data.info.image == 0) {
                                var firstimg = $(data.message.data.info.image).find("img:first").attr("src");
                                $('#info-wrapper .info-image').html('<a class="image-popup-fit-width cursor-zoom pop" href="' + firstimg + '">' + data.message.data.info.image + '</a>').fadeIn(600);

                                $('.image-popup-fit-width').magnificPopup({
                                    type: 'image',
                                    closeOnContentClick: true,
                                    image: {
                                        verticalFit: false
                                    }
                                });
                            }

                        } else {
                            // --------- place holder image/video/content----------------- //
                            $('#info-wrapper .info-content').html('<img src="img/text-placeholder2.jpg" class="placeholder" alt="Text placeholder">');
                            $('#info-wrapper .info-video').html('<img src="img/video-placeholder2.jpg" class="placeholder" alt="video placeholder">');
                            $('#info-wrapper .info-image').html('<img src="img/image-placeholder2.jpg" class="placeholder" alt="Image placeholder">');
                        }*/
                        if (!data.message.data.error == 0) {
                            $('#info-wrapper .info-content').html(errorSystemResponseText).fadeIn(600);
                        }

                        // ---------------- Info for I card Start----------------- //
                        //if (!data.iCard == 0 && !data.message.data.info == 0) {
                        if (!data.message.data.info == 0) {

                            //var infoSliderData = '<ul class="bxslider"><li><iframe src="http://player.vimeo.com/video/17914974" width="500" height="281" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe></li><li ><a href="../img/ticket.jpg" class="image-popup-fit-width cursor-zoom pop"><img src="../img/ticket.jpg" /></a></li><li><p>Your ticket is booked successfully for 750 Dollars. Wish you a happy journey</p></li></ul>';
                            if (!data.message.data.info.video == 0) {
                                var videoSlide = data.message.data.info.video;
                                //var videoSlide = '<img src="img/video-placeholder3.jpg" class="placeholder" alt="video placeholder">';
                            } else {
                                var videoSlide = '<img src="img/video-placeholder3.jpg" class="placeholder" alt="video placeholder">';
                            }
                            if (!data.message.data.info.image == 0) {
                                var imageSlide = '<a href="../img/ticket.jpg" class="image-popup-fit-width cursor-zoom pop">' + data.message.data.info.image + '</a>'
                                //var imageSlide = '<img src="img/image-placeholder2.jpg" class="placeholder" alt="Image placeholder">';
                            } else {
                                var imageSlide = '<img src="img/image-placeholder2.jpg" class="placeholder" alt="Image placeholder">';
                            }

                            if (!data.message.data.info.text == 0) {
                                var textSlide = "<p>" + data.message.data.info.text + "</p>";
                                //var textSlide = '<img src="img/text-placeholder3.jpg" class="placeholder" alt="Text placeholder">';
                            } else {
                                var textSlide = '<img src="img/text-placeholder3.jpg" class="placeholder" alt="Text placeholder">';
                            }
                            //var imageSlide = '<a href="../img/ticket.jpg" class="image-popup-fit-width cursor-zoom pop"><img src="../img/ticket.jpg" /></a>'
                            // var textSlide = 'Your ticket is booked successfully for 750 Dollars. Wish you a happy journey'

                            var infoSliderData = '<ul class="bxslider"><li>' + textSlide + '</li><li >' + imageSlide + '</li><li>' + videoSlide + '</li></ul>';


                            var infoSliderData = '<li class="card-info">' + infoSliderData + '<span class="clearfix"></span></li>'

                        }
                        /*---------------- Info for I card End-----------------*/

                    }
                    /*---------- info Section End ----------------*/

                    if (!$.trim($("#userUtterance").val())) {
                        console.log('textaarea is empty');
                    } else {
                        /*-----Append system and user utterance response---------------*/
                        $("#utterance").append(userUtteranceContent).fadeIn(600);
                        $("#utterance").append(systemUtteranceContentResponse).fadeIn(600);
                        
                        
                         // Add infor slider data if available.
                        $("#utterance").append(infoSliderData).fadeIn(600);
                        //Taks list form data append;
                        $("#utterance").append(iCardDataResponse).fadeIn(600);
                        //Entities form data append;
                        $("#utterance").append(entitiesFormData).fadeIn(600);
                        //console.log(iCardDataResponse);
                       

                        //last card removed
                        $('#utterance').find('.card-1:not(:last)').remove();
                        $('.userUtterance').prev('.card-info').remove();
                        
                        // Date picker function call
                        $(function () {
                            $(".datepicker").datepicker({
                                showOn: "button",
                                buttonImage: "http://jqueryui.com/resources/demos/datepicker/images/calendar.gif",
                                minDate: 0
                                //buttonImageOnly: true
                            });
                        });

                        // time picker function call
                        //$('.timepicker').wickedpicker();
                        $('.timepicker').wickedpicker();

                        // call bx slider for card info
                        $('.bxslider').bxSlider({
                            video: true,
                            useCSS: false
                        });

                        // image popup
                        $('.image-popup-fit-width').magnificPopup({
                            type: 'image',
                            closeOnContentClick: true,
                            image: {
                                verticalFit: false
                            }
                        });

                        // Add focus after appending to active field
                        $(".form-control.active").focus();

                        // Remove inisibile true itom from DOM
                        $('.card-row.inVisible').remove();
                    }

                    //is user has used ASR before, automatically start TTS
                    var systemUtteranceValNew = data.result.speech;
                    if (wants_speech) {
                        tts_msg.lang = select_language.value;
                        /*tts_msg.text = data.message.chat                            
                        speechSynthesis.speak(tts_msg);*/
                        if (select_language.value == "hi") {
                            responsiveVoice.speak("" + systemUtteranceValNew + "", "Hindi Female");
                            speechSynthesis.speak(tts_msg);
                        } else if (select_language.value == "de-DE") {
                            responsiveVoice.speak("" + systemUtteranceValNew + "", "Deutsch Female");
                            speechSynthesis.speak(tts_msg);
                        } else if (select_language.value == "it-IT") {
                            responsiveVoice.speak("" + systemUtteranceValNew + "", "Italian Female");
                            speechSynthesis.speak(tts_msg);
                        } else if (select_language.value == "fr-FR") {
                            responsiveVoice.speak("" + systemUtteranceValNew + "", " French Female");
                            speechSynthesis.speak(tts_msg);
                        } else if (select_language.value == "pt-PT") {
                            responsiveVoice.speak("" + systemUtteranceValNew + "", " Portuguese Female");
                            speechSynthesis.speak(tts_msg);
                        } else {
                            // alert('inside speak else')
                            responsiveVoice.speak("" + systemUtteranceValNew + "", "UK English Female");
                            speechSynthesis.speak(tts_msg);
                        }
                    }
                    $("#userUtterance").val('');

                    $("#scroll-wrap").mCustomScrollbar("scrollTo", "bottom", {
                        scrollEasing: "easeOut"
                    });
					
							
							
							//show more/less code
							
							var showChar = 500;  // How many characters are shown by default
							var ellipsestext = "...";
							var moretext = "Read more...";
							var lesstext = "Read less";
							
								$('.more').each(function() {
									if($(this).find('#systemUtteranceValue').length !==0){
										//$('#systemUtteranceValue').addClass('smallChat');
									}
									else{
									console.log("sachn.."+$(this).find('.morelink').length);
									//var content = $(this).html();
									//console.log("inside more function"+content);
									//if($('.more').height() >= 100)
										//$('.more').addClass('smallChat');
									/*
									if(content.length > showChar) {
										console.log("inside more function"+content.length);
										var c = content.substr(0, showChar);
										var h = content.substr(showChar, content.length);
										console.log("C:"+c);
										console.log("H:"+h);
										var html = c + '<span class="moreellipses">' + ellipsestext+ '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';
										console.log("HTML:"+html);
										$(this).html(html);
										}
										*/
									}
								 
								});
							
							/*
							$(".morelink").on('click',function(e){
								
								console.log("in morelink"+$('.morelink').length);
								e.preventDefault();
								console.log("contents..",$(this).contents());
								var parentDiv = $(this).parent().find('.speech');
								console.log("prev.."+JSON.stringify(parentDiv));
								//console.log("prev..",parentDiv["0"].innerText());
								/*
								if($(this).closest('.media-body').find('.bigChat').length !==0){
									$(this).closest('.text-wrapper').find('.bigChat').toggleClass('bigChat smallChat');
									$(this).text("Read more...");
								} else {
									$(this).closest('.text-wrapper').find('.smallChat').toggleClass('smallChat bigChat');
									$(this).text("Read Less");
								} 
								
								if($(parentDiv).hasClass("smallChat")) {
									i++;
									console.log("in morelink if");
									$(parentDiv).removeClass("smallChat");
									$(parentDiv).addClass("bigChat");
									$(this).html(lesstext);
								} else {
									console.log("in morelink else");
									$(parentDiv).removeClass("bigChat");
									$(parentDiv).addClass("smallChat");
									$(this).html(moretext);
								} 
								
								//$(this).parent().prev().toggle();
								//$(this).prev().toggle();
								return true;
							});  */
							// end of show more/less code
		
                }
				//cd panel code
					//open the lateral panel
							$('.cd-btn').on('click', function(event){
								event.preventDefault();
								console.log("inside cd-button..."+articleId);
								$('.cd-panel-content').html(articleHTML);
								$('.cd-panel').addClass('is-visible');
								
								  //$('#doc-panel').html(doc);
										//$('.view-widget').show();
										var $container = $(".cd-panel-content");
										$container.scrollTop(0);
										var $scrollTo = $("#"+articleId);
										$("#"+articleId).addClass("highlight");
										if($scrollTo.length)
										{
											$('.cd-panel-content').animate({
											scrollTop: $scrollTo.offset().top - 200},'slow');
										}
		
								
							});
							//clode the lateral panel
							$('.cd-panel').on('click', function(event){
								console.log("inside cd-panel...");
								if( $(event.target).is('.cd-panel') || $(event.target).is('.cd-panel-close') ) { 
									$('.cd-panel').removeClass('is-visible');
									event.preventDefault();
								}
							});
							
            })
            .fail(
                function (xhRequest, status,
                    thrownError) {
                    console.log(status);
                    console.log(thrownError);
                });
				
				
				
				
		
				
				
    }
				
				
    /*----------------- Submit Post Call End--------------------*/

    /*---------------- Text/voice Select language function if/else start -------------*/

    /* if ($('#selectLanguage').is(':visible') && $("#selectLanguage").val() !== "en") {
         var selectLanguageValue = $("#selectLanguage").val();
         changeLanguage(userUtteranceVal, selectLanguageValue);
     } else if ($('#select_language').is(':visible') && $("#select_language").val() !== "en-GB") {
         var selectLanguageValue = $("#select_language").val();
         changeLanguage(userUtteranceVal, selectLanguageValue);
     } else {
         //userUtteranceValNew = $("#userUtterance").val();
         if ($('#select_language').is(':visible') && $("#select_language").val() == "en-GB") {
             //  var selectLanguageValue = "en";
             submitPostCall();
             //changeLanguage(userUtteranceVal, selectLanguageValue);
         }
     }
     
     function changeLanguage(srcTxt, selectLanguageVal) {
         //console.log("step 2...");
         var locationLanguageSelection = location1 + "/translateLanguage?sourceLanguage=" + selectLanguageValue + "&targetLanguage=en&sourceText=" + srcTxt;
         $.post(locationLanguageSelection, function (data) {
             //console.log("step 3...");
             userUtteranceVal = data.targetText;
             userUtteranceValNew = data.sourceText;
             submitPostCall();
         });
     }*/
    //submitPostCall();

    /*---------------- Text/voice Select language if/else function End -------------*/

    /*------------------------- spell correct if condiotion start ---------------*/
    if ($("#btnText").hasClass("active") && $("#text-auto-mode").is(':checked') ){
	//&& $("#selectLanguage").val() == "en") {
        wants_speech = false;
        locationSpellChecker = location1 + "/spellChecker";
        console.log(locationSpellChecker);
        $.post(locationSpellChecker, {
                userUtterance: userUtteranceVal
            },
            function (data) {
                console.log(data);
                userUtteranceVal = data.response;
                userUtteranceValNew = data.response;
                submitPostCall();
            }
        );
    } else {
        /*if ($('#selectLanguage').is(':visible') && $("#selectLanguage").val() == "en") {
            submitPostCall();
        }
        else if ($('#select_language').is(':visible')) {
            submitPostCall();
        }*/
        submitPostCall();
    }
    /*------------------------- spell correct if condiotion End ---------------*/
}



				$(document).on('click', '.media-body .speech a', function (e) {
								//console.log("morelink Length:"+$('.morelink').length);
								//console.log("Media Body",$(this).contents());
								//var morelinkLength = $('.morelink').length;
								
								if($(this).attr("href") == "#") {
									console.log("inside click");
									
									
									e.preventDefault();
										if($(this).closest('.media-body').find('.bigChat').length !==0){
											$(this).closest('.media-body').find('.bigChat').toggleClass('bigChat smallChat');
											$(this).text("Read more...");
										} else {
											$(this).closest('.media-body').find('.smallChat').toggleClass('smallChat bigChat');
											$(this).text("Read Less");
										}
									

								}
							});
					
					
							
							
/*------------- Interactive Cards task button click start --------------*/
$(document).on('click', '.btnCardTask', function () {
    var thisValue = "#" + $(this).attr("name");
    var utteranceValue = $(this).val();
    $("textarea#userUtterance").val(utteranceValue);

    submit(thisValue, utteranceValue);
    //userUtteranceVal = thisValue;
    //trimUserUtterance = thisValue;
});
/*-------- Card Cancel Task click function start --------------*/
$(document).on('click', '#cancelTaks1', function () {
    var thisValue = $(this).attr("name");;
    $("textarea#userUtterance").val(thisValue);

    submit($("#userUtterance").val(), $("#userUtterance").val());
});
/*-------- Card Cancel Task click function End --------------*/
/*------------- Interactive Cards task button click End --------------*/

// select langauge change button function start
/*$("#selectLanguage").change(function () {
    selectLanguageValue = $("#selectLanguage").val();
});*/
/*-------------------------- On Submit Function Call End  --------------------------*/

/*-------------------------- Show Error Function Start  --------------------------*/
function showError(error, fatal) {
    if (error != null || error != undefined || error != 'not-allowed') {
        $('#error').show(0).delay(3500).hide(0);
        $("#error").html(error);
    } else if (fatal) {
        $('#loader').removeClass("loading");
        $('#container').delay(3500).animate({
            opacity: .2
        }, 2500);

    } else {
        $("#error:hidden:first").fadeIn(1000).delay(2000).fadeOut(1000);
    }
}
/*-------------------------- Show Error Function End  --------------------------*/

/*-------------------------------- Google Web Speech API Start ---------------------*/

if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
    showError(
        "Your Browser doesn't support speech recognition. Try Chrome.",
        false);
    $('#recobtn').prop('disabled', true);

} else {
    // if($("#btnVoice").hasClass("active")){

    browserSupportsSpeech = true;
    var auto_submit = true;
    //TTS
    var tts_msg = new SpeechSynthesisUtterance();
    //tts_msg.lang = 'en-GB';
    //alert(select_language.value);
    //tts_msg.lang = select_language.value;

    tts_msg.onend = function (e) {
        start_stop_recognition();
        //recognition.stop();
    };
    //ASR
    var recognizing = false;
    var final_transcript = '';
    var ignore_onend = false;
    var start_timestamp;
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    /*------------ speech recognition OnError Event Start------------------*/
    recognition.onerror = function (event) {
        ignore_onend = true;
        //updateGui(false);
        wants_speech = false;
        if ($("#btnVoice").hasClass("active")) {

            if (event.error == 'no-speech') {
                start_img.src = 'img/mic.png';
                showInfo('info_no_speech');
            }
            if (event.error == 'audio-capture') {
                start_img.src = 'img/mic.png';
                showInfo('info_no_microphone');
            }
            if (event.error == 'not-allowed') {
                if (event.timeStamp - start_timestamp < 100) {
                    showInfo('info_blocked');
                } else {
                    showInfo('info_denied');
                }
            }
        } else {
            start_img.src = 'img/mic-disabled.png';
        }

    };
    /*------------ speech recognition OnError Event End------------------*/

    /*------------ speech recognition OnStart Event Start------------------*/

    recognition.onstart = function () {
        recognizing = true;
        start_img.src = 'img/mic-animate.gif';
        showInfo('info_speak_now');
        //console.log('Speech recognition service has started');
    };
    /*------------ speech recognition OnStart Event End------------------*/

    /*------------ speech recognition OnEnd Event Start------------------*/
    recognition.onend = function () {
        recognizing = false;
        if (ignore_onend) {
            return;
        }
        if (!recognition.continuous) {
            recognition.stop();
        }
        start_img.src = 'img/mic.png';
        if (!final_transcript) {

            showInfo('info_start');
            return;
        }
        showInfo('');
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
            var range = document.createRange();
            range.selectNode(document.getElementById('final_span'));
            window.getSelection().addRange(range);
        }
    };
    /*------------ speech recognition OnEnd Event End------------------*/

    /*------------ speech recognition OnResult Event Start------------------*/
    recognition.onresult = function (event) {
        var interim_transcript = '';
        if (typeof (event.results) == 'undefined') {
            recognition.onend = null;
            recognition.stop();
            showError("Result undefined", false);
            return;
        }

        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }
        $("#userUtterance").val(final_transcript);
        if (!recognition.continuous) {
            recognition.stop();
        }
        if (auto_submit)
            submit($("#userUtterance").val(), $("#userUtterance").val());
    };
    /*------------ speech recognition OnResult Event End------------------*/
    /*------------ Function  start stop recognition start------------------*/
    window.start_stop_recognition = function () {
        if ($("#btnVoice").hasClass("active")) {
            if (recognizing) {
                recognition.stop();
                wants_speech = false;
                start_img.src = 'img/mic.png';
                ignore_onend = true;
                return;
            }
            wants_speech = true;
            final_transcript = '';
            recognition.lang = select_language.value;
            if ($('#voice-auto-mode').is(':checked')) {
                recognition.start();
            }
            if ($('#voice-manual-mode').is(':checked')) {
                recognition.stop();
            }
            ignore_onend = false;
            start_img.src = 'img/mic.png';
        } else {
            start_img.src = 'img/mic-disabled.png';
        }
    }
    /*------------ Function  start stop recognition End------------------*/
    /*------------ Show Info Function start------------------*/
    function showInfo(s) {
        if (s) {
            for (var child = info.firstChild; child; child = child.nextSibling) {
                if (child.style) {
                    child.style.display = child.id == s ? 'inline' : 'none';
                }
            }
            $("#info").show().delay(3500).fadeOut(1000);

        } else {
            $("#info").hide();
        }
    }
    /*------------ Show Info Function end------------------*/


    //}
    /*------------ Record button start------------------*/
    $("#recobtn").click(function (event) {

        if ($("#btnVoice").hasClass("active")) {
            start_stop_recognition();
        }
        start_img.src = 'img/mic-slash.png';
        if (recognizing) {
            console.log('inside recognizing...');
            recognition.stop();
            return;
        }
        if (!$('#voice-auto-mode').is(':checked')) {
            recognition.start();
        }
    });
    /*------------ Record button End------------------*/
}
/*-------------------------------- Google Web Speech API End ---------------------*/


/*----------------- Get Date function Start--------------------*/
function getDate() {
    var d = new Date();
    var year = d.getFullYear();
    var date = d.getDate();
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var day = days[d.getDay()];
    var month = months[d.getMonth()];
    return day + ', ' + month + ' ' + date + ', ' + year;
}
$('.date').text(getDate());
/*----------------- Get Date function End--------------------*/


/*------------- Set Column Height Start -----------------*/
function setHeight() {
    windowHeight = $(window).innerHeight();
    $('#task-details').css('height', windowHeight - 64);
    $("#scroll-wrap").css('height', windowHeight - 480);
};
setHeight();
$(window).resize(function () {
    setHeight();
});
/*------------- Set Column Height End -----------------*/

/*------------ Exit chat start--------------------*/
$('#exit, .icon-exit').click(function () {
    $.post(locationInt + '/terminate',
        function (data) {
            console.log(data + '...inside exit data...')
        }
    );

    $("#login-wrapper").fadeIn("fast");
    $(".chat-wrapper, #home-wrapper, #welcome-wrapper").fadeOut("fast");
    $('#utterance').empty();
    $("#username, #password, #userUtterance").val('');
    $("#loading-small").hide();
    location.reload();
});
/*-------------- Exit chat end-----------------*/

/*----------------- Clear Chat Start ------------------*/
$('#clearChat').click(function () {
    $('#utterance').empty();
});
/*----------------- Clear chat end -------------------*/
$(document).on("click", ".popover .close", function () {
    $(this).parents(".popover").popover('hide');
});

/*------------ Logout Click start --------------*/
$(document).on("click", "#logout", function () {
    $.post(locationInt + '/terminate',
        function (data) {
            console.log(data + '...inside logout...')
        }
    );
    //$(".chat-wrapper").hide(); 
    $(".chat-wrapper, #home-wrapper, #welcome-wrapper").fadeOut("fast");
    $("#login-wrapper").fadeIn();
    $("#username, #password, #userUtterance").val('');
    $("#loading-small").hide();
    location.reload();
});
/*------------ Logout Click End --------------*/

/*---------------- Voice and Text toggle start----------------*/
$('#radioBtn a').on('click', function () {
    var sel = $(this).data('title');
    var tog = $(this).data('toggle');
    $('#' + tog).prop('value', sel);

    $('a[data-toggle="' + tog + '"]').not('[data-title="' + sel + '"]').removeClass('active').addClass('notActive');
    $('a[data-toggle="' + tog + '"][data-title="' + sel + '"]').removeClass('notActive').addClass('active');
})

$("#radio-text-wrapper, #radio-voice-wrapper").hide();

$("#radio-text-wrapper").show();
$("#select_language").hide();
$(document).on("click", "#btnVoice", function () {
    $("#userUtterance").attr('disabled', true);
    $("#btnSubmit").attr('disabled', true);
    $("#recobtn").attr('disabled', false);
    //$('#selectLanguage').val('en').trigger('change');
    $("#radio-voice-wrapper").show();
    $("#radio-text-wrapper").hide();

    //$("#selectLanguage").hide();

    $("#select_language").show();

    start_img.src = 'img/mic.png';
});
$(document).on("click", "#btnText", function () {
    disableVoice();
    $("#select_language").hide();
    //$("#selectLanguage").show();
    //$("#selectLanguage").val($("#selectLanguage option:first").val());
});
if ($("#btnText").hasClass('active')) {
    disableVoice();
}

/*------------ Function Disabled Voice start------------------*/
function disableVoice() {
    wants_speech = false;
    $("#userUtterance").attr('disabled', false);
    $("#btnSubmit").attr('disabled', false);
    $("#recobtn").attr('disabled', true);

    $("#radio-voice-wrapper").hide();
    $("#radio-text-wrapper").show();

    start_img.src = 'img/mic-disabled.png';
}
/*------------ Function Disabled Voice End------------------*/

/*--------------Voice/Text Switch Toggle Start -----------------*/
$(".switch-toggle label").on('click', function () {
    $('.switch-toggle label').removeClass('active');
    $(this).addClass('active');
});
/*--------------Voice/Text Switch Toggle End -----------------*/

/*---------------- Voice and Text toggle End----------------*/

/*------------------------ Help/Scubscribe popup start --------------------*/
$("a[class*='popup-gallery-']").magnificPopup({
    //$('.open-help-popup').magnificPopup({
    type: 'inline',
    midClick: true // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
});
/*------------------------ Help/Subscribe popup End --------------------*/

/*----------- Translate dropdown (keyboard) lanngauge selection Start ------------*/

$('#selectLanguage').on('change', function () {
    if (this.value == "en") {
        transliterationControl.disableTransliteration();
    } else {
        languageChangeHandler()
    }
});
/*----------- Translate dropdown (keyboard) lanngauge selection End ------------*/