var scrollTop, windowHeight, scrollThreshold, activePanel = 'intro';

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

        $('.uit-arrow--back').click(function() {
            this.progress('back');
        }.bind(this));

        $('.uit-arrow--forward').click(function() {
            this.progress('forward');
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

        $('.uit-slide-scroll').each(function(i, el) {
            if (scrollTop > $(el).offset().top) {
                activePanel = $(el).data('slide');
            }
        }.bind(this));

        $('.is-active').removeClass('is-active');
        $('.uit-slide--' + activePanel).addClass('is-active');
        this.setButtonStates(activePanel);
        this.updateTimeline();
    },

    updateTimeline: function(activePanel) {
        $('.uit-timeline__point').removeClass('is-active is-passed');

        $('.uit-timeline__point').each(function(i, el) {
            var currentPanel = $(el).data('slide');

            if (activePanel == currentPanel) {
                $(el).addClass('is-active');
            } else if (activePanel > currentPanel) {
                $(el).addClass('is-passed');
            }
        }.bind(this));
    },

    setButtonStates: function() {
        $('.uit-arrow').removeClass('is-disabled');

        if (activePanel == 'intro') {
            $('.uit-arrow--back').addClass('is-disabled');
        } else if (activePanel == 'end') {
            $('.uit-arrow--forward').addClass('is-disabled');
        }
    },

    progress: function(direction) {
        if (direction === 'back' && activePanel > -1) {
            activePanel--;
        } else if (direction === 'forward' && activePanel < $('.uit-slide').length) {
            activePanel++;
        }

        $(window).scrollTop($('.uit-slide--' + activePanel).offset().top + 1);
    }
};
