(function ($) {
    $.fn.initNumberInput = function () {
        $('.numInput I').unbind().click(function () {
            var $direction = $(this).attr('data-dir'),      // = "plus" or "minus"
                $minVal = $(this).parent().attr('data-min'),
                $maxVal = $(this).parent().attr('data-max'),    
                $step = 1,  //this is set later, 1 is just a default value
                $stepAttr = $(this).parent().attr('data-step'),
                $currentValue = Number($(this).parent().find('.numInputValue').text());
            //Check and set steps.
            if (typeof $stepAttr !== typeof undefined && $stepAttr !== false) {
                $step = $stepAttr;
            }
            //if plus/up button is clicked
            if ($direction === 'plus') {
                $currentValue += Number($step);
                if ($currentValue >= $maxVal) {
                    $currentValue = $maxVal;
                }
            }
            else { //if minus/down button is clicked
                $currentValue -= Number($step);
                if ($currentValue <= $minVal) {
                    $currentValue = $minVal;
                }
            }
            //update value
            $(this).parent().find('.numInputValue').text($currentValue);
        });
        
        //Allow numbers only in number input
        $('[contenteditable]').on("keypress keyup blur",function (event) {
            var $useDecimal = $(this).parent().attr('data-decimal');
            //if allowDecimal is on
            if ($useDecimal === true) {
                $(this).val($(this).val().replace(/[^\d].+/, ""));
                if ((event.which < 48 || event.which > 57)) {
                    event.preventDefault();
                }
            } else { //if allowDecimal is off
                $(this).val($(this).val().replace(/[^0-9\.]/g,''));
                if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                    event.preventDefault();
                }
            }                
        });
        
    }
    $.fn.createInput = function (options) {
        var defaultInputSettings = $.extend(true, {
                // These are the default settings, can be changed on use.
                inputType: 'number',
                inputClass: '',
                importFontAwesome: true,
                theme: '',
                number: {
                    values: {
                        defaultValue: 0,
                        minValue: null,
                        maxValue: null,
                        step: 1,
                        allowDecimal: false
                    },
                    plusBtn: {
                        btnClass: 'plusBtn',
                        btnText: '+'
                    },
                    minusBtn: {
                        btnClass: 'minusBtn',
                        btnText: '-'
                    }
                },
                text: {
                    values: {
                        defaultValue: '',
                        placeholder: '',
                        maxLength: null
                    }
                }
            }, options),
            
            $isTypeNumber = defaultInputSettings.inputType === 'number',
            $isTypeText = defaultInputSettings.inputType === 'text',
            $additionalClasses = '',
            inputInnerHTML = '',
            fontCSSurl = 'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css';
    
        if (defaultInputSettings.importFontAwesome) {
            $('HEAD').append('<link rel="stylesheet" href="' + fontCSSurl + '" type="text/css" />');
        }
        if ($isTypeText) {
            //Text input
            if (defaultInputSettings.inputClass === '') {
                defaultInputSettings.inputClass = 'textInput';
            }
            else {
                defaultInputSettings.inputClass += 'textInput';
            }
            inputInnerHTML = '<input type="text" class="textInputValue" placeholder="' + defaultInputSettings.text.values.placeholder + '" value="' + defaultInputSettings.text.values.defaultValue + '" maxlength="' + defaultInputSettings.text.values.maxLength + '"></span><i class="fa fa-pencil"></i>';
        }
        else if ($isTypeNumber) {
            //Number input
            if (defaultInputSettings.inputClass === '') {
                defaultInputSettings.inputClass = 'numInput';
            }
            else {
                defaultInputSettings.inputClass += 'numInput';
            }
            inputInnerHTML = '<i class="' + defaultInputSettings.number.plusBtn.btnClass + '" data-dir="plus">' + defaultInputSettings.number.plusBtn.btnText + '</i><i class="' + defaultInputSettings.number.minusBtn.btnClass + '" data-dir="minus">' + defaultInputSettings.number.minusBtn.btnText + '</i><span class="numInputValue" contenteditable>' + defaultInputSettings.number.values.defaultValue + '</span>';
        }
        else {
            // Error
            inputInnerHTML = '<p style="color: red; font-weight: bold;">Choose input type!</p>';
            this.html(inputInnerHTML);
            return false;
        }
        if (defaultInputSettings.theme !== '') {
            $additionalClasses += defaultInputSettings.theme;
        }
        else {
            $additionalClasses += 'theme-default ';
        }
        return this.empty().append(inputInnerHTML).addClass([
            defaultInputSettings.inputClass,
            $additionalClasses
        ].join(' ')).attr({
            'data-min': defaultInputSettings.number.values.minValue,
            'data-max': defaultInputSettings.number.values.maxValue,
            'data-step': defaultInputSettings.number.values.step,
            'data-decimal': defaultInputSettings.number.values.allowDecimal
        }).initNumberInput();
    };
}(jQuery));