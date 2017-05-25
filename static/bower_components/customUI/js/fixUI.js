/******************************************************************

* Copyright (C): 北京泰合佳通信息技术有限公司广东分公司

* 创建人: 林俊杰

* 创建时间: 2015年8月6日

******************************************************************/

'use strict';

//Make sure jQuery has been loaded before app.js
if (typeof jQuery === "undefined") {
    throw new Error("AdminLTE requires jQuery");
}

$.fixUI = {};

$.fixUI.content = {
    activate: function () {
        $.fixUI.content.setHeight();
        $(window).resize(function () {
            $.fixUI.content.setHeight();
        });
    },
    //设置页面容器的高度
    setHeight: function () {
        //显示宽度小于480px的时候不处理
        if ($(window).width() < $.AdminLTE.options.screenSizes.xs) {
            return;
        }
        //内容区域高度
        var content_height = $(window).height() - $('.main-header').outerHeight() - $(".content-header").outerHeight();
        //tree白色背景box内容高度
        var tree_height = 0;
        //grid高度
        var grid_height = 0;
        //树形列表高度
        var treelist_height = 0;
        //判断是否左侧为tree右侧为grid的页面
        if ($(".content .box-body").length > 0 && $(".content .box-body .k-treeview").length > 0)
        {
            //gridContent高度
            var gridContent_height = 0;
            //判断显示宽度是否小于992
            if ($(window).width() < $.AdminLTE.options.screenSizes.md) {
                //tree白色背景box内容高度
                $(".box-body").height("");
                //tree高度
                $(".k-widget.k-treeview").height("");
                //grid高度
                $(".k-grid,k-widget,k-reorderable").height("");
                //gridContent高度
                $(".k-grid-content").height("");
            }
            else {
                //grid列头高度+分页的高度
                var grid_PagerHeader = $(".k-pager-wrap,k-grid-pager,k-widget").outerHeight() + $(".k-grid-header").outerHeight();
                //grid外边框大小
                var grid_Border = $(".k-grid").outerHeight() - $(".k-grid").height();
                //tree白色背景box头部标题高度
                var treeHeader_height = $("[class=nav]").outerHeight();
                //grid白色背景box头部操作栏高度
                var gridHeader_height= $(".box-header").outerHeight() ;
                //grid白色背景box上下间隙
                var sumSpace1 = ($(".content").outerHeight() - $(".content").height())
                //grid白色背景box上下间隙加grid外边框大小
                var sumSpace2 = ($(".content").outerHeight() - $(".content").height()) + grid_Border;
                //tree白色背景box内容高度
                tree_height = content_height - treeHeader_height - sumSpace1;
                //grid的高度
                grid_height = content_height - gridHeader_height - sumSpace2;
                //grid内容的高度
                gridContent_height = grid_height - grid_PagerHeader;
                //tree白色背景box内容高度
                $(".box-body").css('height', tree_height);
                //tree高度
                $(".k-widget.k-treeview").css('height', tree_height - 20);
                //grid高度
                $(".k-grid,k-widget,k-reorderable").css('height', grid_height);
                //gridContent高度
                $(".k-grid-content").css('height', gridContent_height);
            }
        }
        else if ($(".content .tree-list .k-treelist").length > 0)//树列表
        {            
            //是否既包含grid又包含treeList的页面
            if ($(".content .grid-data .k-grid").length > 0)
            {
                //tabgrid的高度,tabgridContent的高度
                var tabgrid_height = 0, tabgridContent_height = 0;
                //grid列头高度+分页的高度
                var grid_PagerHeader = $(".k-pager-wrap,k-grid-pager,k-widget").outerHeight() + $(".k-grid-header").outerHeight();
                var tabgrid_PagerHeader =( $($(".k-pager-wrap,k-grid-pager,k-widget")[1]).outerHeight() < 50 ? 50 : $($(".k-pager-wrap,k-grid-pager,k-widget")[1]).outerHeight() )+ $(".k-grid-header").outerHeight();
                //grid白色背景box头部操作栏高度
                var gridHeader_height = $(".box-header").outerHeight();
                //grid外边框大小
                var grid_Border = $(".k-grid").outerHeight() - $(".k-grid").height();
                //grid白色背景box上下间隙加grid外边框大小
                var sumSpace2 = ($(".content").outerHeight() - $(".content").height()) + grid_Border;
                //判断显示宽度是否小于992
                if ($(window).width() < $.AdminLTE.options.screenSizes.md) {
                    //设置左边grid高度
                    $(".grid-data .k-grid,k-widget,k-reorderable").height("");
                    //设置左边grid内容高度
                    $(".grid-data .k-grid-content").height("");
                    //设置右边边tree内容高度
                    $(".tree-list .k-grid-content").height("");
                    //设置右边tabgrid高度
                    $(".grid-tab .k-grid,k-widget,k-reorderable").height("");
                    //设置右边tabgrid内容高度
                    $(".grid-tab .k-grid-content").height("");
                }
                else {
                    //grid的高度
                    grid_height = content_height - gridHeader_height - sumSpace2;
                    //grid内容的高度
                    gridContent_height = grid_height - grid_PagerHeader;
                    //tree内容的高度(tree只需要设置内容的高度)
                    treelist_height = content_height - ($(".content").outerHeight() - $(".content").height()) - $(".nav.nav-tabs.pull-right.ui-sortable-handle").outerHeight() - $(".k-grid-header").outerHeight() - ($($(".tab-content .box-header")[0]).outerHeight() || $($(".tab-content .box-header")[1]).outerHeight()) - ($(".tab-content").outerHeight() - $(".tab-content").height()) - grid_Border;
                    //tabgrid的高度(相对于tree不需要减去头部列的高度)
                    tabgrid_height = content_height - ($(".content").outerHeight() - $(".content").height()) - $(".nav.nav-tabs.pull-right.ui-sortable-handle").outerHeight() -( $($(".tab-content .box-header")[0]).outerHeight() || $($(".tab-content .box-header")[1]).outerHeight()) - ($(".tab-content").outerHeight() - $(".tab-content").height()) - grid_Border;
                    //tabgrid内容的高度在tree内容高度的基础上减去头部列高度和底部分页高度
                    tabgridContent_height = tabgrid_height - tabgrid_PagerHeader;
                    //设置左边grid高度
                    $(".grid-data .k-grid,k-widget,k-reorderable").css('height', grid_height);
                    //设置左边grid内容高度
                    $(".grid-data .k-grid-content").css('height', gridContent_height);
                    //设置右边边tree内容高度
                    $(".tree-list .k-grid-content").css('height', treelist_height);
                    //设置右边tabgrid高度
                    $(".grid-tab .k-grid,k-widget,k-reorderable").css('height', tabgrid_height);
                    //设置右边tabgrid内容高度
                    $(".grid-tab .k-grid-content").css('height', tabgridContent_height);
                }                
            }
            else {
                if ($(window).width() < $.AdminLTE.options.screenSizes.md) {
                    $(".k-grid-content").height("");
                }
                else {
                    //grid白色背景box头部操作栏高度
                    var gridHeader_height = $(".box-header").outerHeight();
                    //grid外边框大小
                    var grid_Border = $(".k-grid").outerHeight() - $(".k-grid").height();
                    //grid白色背景box上下间隙加grid外边框大小
                    var sumSpace2 = ($(".content").outerHeight() - $(".content").height()) + grid_Border;
                    //tree内容高度
                    treelist_height = content_height - sumSpace2 - gridHeader_height - $(".k-grid-header").outerHeight();
                    //设置右边边tree内容高度
                    $(".k-grid-content").css('height', treelist_height);
                }
            }
        }
        else if ($(".content .grid-data .k-grid").length > 0)//只包含grid
        {
            //grid列头高度+分页的高度
            var grid_PagerHeader = $(".k-pager-wrap,k-grid-pager,k-widget").outerHeight() + $(".k-grid-header").outerHeight();
            //grid外边框大小
            var grid_Border = $(".k-grid").outerHeight() - $(".k-grid").height();
            //判断显示宽度是否小于992
            if ($(window).width() < $.AdminLTE.options.screenSizes.md) {
                //grid高度
                $(".k-grid,k-widget,k-reorderable").height("");
                //gridContent高度
                $(".k-grid-content").height("");
            }
            else {
                //grid白色背景box上下间隙加grid外边框大小
                var sumSpace2 = ($(".content").outerHeight() - $(".content").height()) + grid_Border;
                //grid白色背景box头部操作栏高度
                var gridHeader_height = $(".box-header").outerHeight();
                //grid的高度
                grid_height = content_height - gridHeader_height - sumSpace2;
                //grid内容的高度
                gridContent_height = grid_height - grid_PagerHeader;
                //grid高度
                $(".k-grid,k-widget,k-reorderable").css('height', grid_height);
                //gridContent高度
                $(".k-grid-content").css('height', gridContent_height);
            }
        }
    }
}