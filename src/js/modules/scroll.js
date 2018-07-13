var scrollTop, windowHeight, scrollThreshold;

module.exports =  {
    init: function() {
        this.bindings();
        this.setValues();
        this.onScroll();
    },

    bindings: function() {
        $(window).scroll(function() {
            this.onScroll();
        }.bind(this));
    
        $(window).resize(function() {
            this.setValues();
            this.onScroll();
        }.bind(this));

        $(document).keydown(function(e) {
            if (e.keyCode == 37) {
                this.progress('back')
            } else if (e.keyCode == 39) {
                this.progress('forward');
            }
        }.bind(this));
    },

    setValues: function() {
        windowHeight = $(window).height();
        scrollThreshold = $('.uit-slide-scroll').height() + 1;
    },

    onScroll: function() {
        scrollTop = $(window).scrollTop();

        var activePanel = 0;

        $('.uit-slide-scroll').each(function(i, el) {
            if (scrollTop > $(el).offset().top) {
                activePanel = $(el).data('slide');
            }
        }.bind(this));

        $('.is-active').removeClass('is-active');
        console.log('showing ' + activePanel);
        $('.uit-slide--' + activePanel).addClass('is-active');
    },

    progress: function(direction) {
        if (direction === 'back') {
            $(window).scrollTop(scrollTop - scrollThreshold);
        } else if (direction === 'forward') {
            $(window).scrollTop(scrollTop + scrollThreshold);
        }
    }
};
