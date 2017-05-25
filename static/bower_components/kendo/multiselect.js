(function ($) {

    var kendo = window.kendo,
        ui = kendo.ui,
        DropDownList = ui.DropDownList;

    var MultiSelectBox = DropDownList.extend({

        init: function (element, options) {

            options.template = kendo.template(
                kendo.format('<input type="checkbox" /><span data-value="#= {0} #">#= {1} #</span>',
                    options.dataValueField,
                    options.dataTextField
                )
            );

            DropDownList.fn.init.call(this, element, options);
        },

        options: {
            name: "MultiSelectBox",
            index: -1
        },

        _focus: function (li) {
            var that = this
            if (that.popup.visible() && li && that.trigger("select", { item: li })) {
                that.close();
                return;
            }
            that._select(li);
        },

        _select: function (li) {
            var that = this,
                 current = that._current,
                 data = that._data(),
                 value,
                 text,
                 idx;

            li = that._get(li);

            if (li && li[0]) {
                idx = ui.List.inArray(li[0], that.ul[0]);
                if (idx > -1) {

                    //获取元素li中checkbox被选中的项
                    var selecteditems = $(that.ul[0]).find("input:checked").closest("li");

                    value = [];
                    text = [];
                    $.each(selecteditems, function (indx, item) {
                        var obj = $(item).children("span").first();
                        value.push(obj.attr("data-value"));
                        text.push(obj.text());
                    });

                    that.text(text.join(", "));
                    that._accessor(value !== undefined ? value : text, idx);
                }
            }

        },

        value: function (value) {
            var that = this,
                idx,
                valuesList = [];

            if (value !== undefined) {

                if (!$.isArray(value)) {
                    valuesList.push(value);
                }
                else {
                    valuesList = value;
                }

                $.each(valuesList, function (indx, item) {
                    if (item !== null) {
                        item = item.toString();
                    }

                    that._valueCalled = true;

                    if (item && that._valueOnFetch(item)) {
                        return;
                    }

                    idx = that._index(item);

                    that.select(idx > -1 ? idx : 0);

                });

            }
            else {
                return that._accessor();
            }
        }

    });

    ui.plugin(MultiSelectBox);

})(jQuery);