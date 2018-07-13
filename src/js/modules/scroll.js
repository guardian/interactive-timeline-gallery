var scrollTop, windowHeight;

module.exports =  {
    init: function() {
        this.bindings();
        this.setValues();
    },

    bindings: function() {
        $(window).scroll(function() {
            this.onScroll();
        }.bind(this));
    },

    setValues: function() {
        windowHeight = $(window).height();
    },

    onScroll: function() {
        scrollTop = $(window).scrollTop();

        var activePanel = 0;

        $('.uit-slide-scroll').each(function(i, el) {
            if (scrollTop > $(el).offset().top) {
                activePanel = $(el).data('slide');
            }
        }.bind(this));

        console.log(activePanel);
    }
};
