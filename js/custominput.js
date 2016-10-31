(function ($) {

    var defaultTypesSettings = {
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
    };

    var defaultCSSClasses = {
        number: 'numInput',
        text: 'textInput'
    };

    var innerInputHtml = {
        number: function(settings, instance) {
            return '<i class="' + settings.number.plusBtn.btnClass + '" data-dir="plus">' + settings.number.plusBtn.btnText + '</i><i class="' + settings.number.minusBtn.btnClass + '" data-dir="minus">' + settings.number.minusBtn.btnText + '</i><span class="numInputValue" contenteditable>' + settings.number.values.defaultValue + '</span>';
        },
        text: function(settings) {
            return '<input type="text" class="textInputValue" placeholder="' + settings.text.values.placeholder + '" value="' + settings.text.values.defaultValue + '" maxlength="' + settings.text.values.maxLength + '"></span><i class="fa fa-pencil"></i>';
        }
    };

    var customeInputBehavior = {
        number: NumberInputBehavior
    }

    var defaultErrorHtml = '<p style="color: red; font-weight: bold;">Choose input type!</p>';

    var fontAwesomeImported = false;

    function NumberStepper(stepper, numberInput) {
        this.$stepper = $(stepper).click(onClick);

        var direction = this.$stepper.attr('data-dir');      // = "plus" or "minus"
        var settings = numberInput._numberInputSettings;
        
        function onClick() {
            //if plus/up button is clicked
            if (direction === 'plus') {
                settings.currentValue += settings.step;
                if (settings.maxVal !== null && settings.currentValue >= settings.maxVal) {
                    settings.currentValue = settings.maxVal;
                }
            } else { 
            //if minus/down button is clicked
                settings.currentValue -= settings.step;
                if (settings.minVal !== null && settings.currentValue <= settings.minVal) {
                    settings.currentValue = settings.minVal;
                }
            }

            settings.$inputvalueEl.text(settings.currentValue);
        }
    }


    function NumberInputBehavior (el, numberSettings) {
        var $inputValueEl = el.find('.numInputValue');

        el._numberInputSettings = {
            $inputvalueEl: $inputValueEl,
            minVal: numberSettings.values.minValue,
            maxVal: numberSettings.values.maxValue,
            useDecimal: !!numberSettings.values.allowDecimal,
            step: Number(numberSettings.values.step) || 1,
            currentValue: Number($inputValueEl.text()),
        };

        el
        .find('I')
        .each(function() {
            new NumberStepper(this, el);
        });

        function onPressWithDecimal() {
            $inputValueEl.val($inputValueEl.val().replace(/[^\d].+/, ""));
            if ((event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
        }

        function onPressWithoutDecimal() {
            var newValue = $inputValueEl.val().replace(/[^0-9\.]/g,'');
            $inputValueEl.val(newValue);
            if ((event.which != 46 || newValue.indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
        }
        
        //Allow numbers only in number input
        $inputValueEl.on("keypress keyup blur",el._numberInputSettings.useDecimal ? onPressWithDecimal : onPressWithoutDecimal)
        
    }

    function getInputType(options) {
        return options || 'number';
    }

    function getInputTypeCustomeDefaultSettings(type) {
        var obj = {};
        obj[type] = defaultTypesSettings[type] || {};
      return obj;
    }

    function getInputTypeCSSClass(type) {
        return ' ' + defaultCSSClasses[type];
    }


    function importFontAwesome() {
        if(fontAwesomeImported) return;

        var fontCSSurl = 'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css';
        $('HEAD').append('<link rel="stylesheet" href="' + fontCSSurl + '" type="text/css" />');
        fontAwesomeImported = true;
    }

    function getInputSettings(options) {
        var type = getInputType(options.inputType);
        return $.extend(true, {
                // These are the default settings, can be changed on use.
                inputType: type,
                inputClass: '',
                importFontAwesome: true,
                theme: 'theme-default ',
            }, getInputTypeCustomeDefaultSettings(type), options);
    }

    function customInput (options) {
        var settings = getInputSettings(options);
    
        if (settings.importFontAwesome) {
            importFontAwesome();
        }

        settings.inputClass += getInputTypeCSSClass(settings.inputType);

        if(innerInputHtml[settings.inputType]) {
            this
            .empty()
            .append(innerInputHtml[settings.inputType](settings, this))
            .addClass([].concat(settings.inputClass, settings.theme).join(' '));

            if(customeInputBehavior[settings.inputType]) {
                // send the instance, and the custom settings for this perticular type
                settings._cumstomBehavior = new NumberInputBehavior(this, settings[settings.inputType]);
            }

        } else {
            this.html(defaultErrorHtml);
                  
        }

        return this;
    }

    $.fn.createInput = function (options) {
        this.each(function() {
            customInput.call($(this), options);
        });
        return this;
    };
}(jQuery));