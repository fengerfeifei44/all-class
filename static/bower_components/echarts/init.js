/******************************************************************

 * Copyright (C): 北京泰合佳通信息技术有限公司广东分公司
 *
 * 描述: 基于 Echarts 公共初始化文件
 *      1.加载Echarts核心文件
 *      2.定义样式 , 图表类型

 ******************************************************************/

define(['echarts/echarts'], function (echarts) {
    'use strict';

    // 样式定义
    echarts.Themes = {
        macarons: 'macarons',
        infographic: 'infographic',
        shine: 'shine',
        dark: 'dark',
        blue: 'blue',
        green: 'green',
        red: 'red',
        gray: 'gray',
        helianthus: 'helianthus',
        roma: 'roma',
        mint: 'mint',
        macarons2: 'macarons2',
        sakura: 'sakura',
        default: 'default'
    };

    // 图表定义
    echarts.Paths = {                                     
        line: 'echarts/chart/line',
        bar: 'echarts/chart/bar',
        scatter: 'echarts/chart/scatter',
        pie: 'echarts/chart/pie',
        radar: 'echarts/chart/radar',
        venn: 'echarts/chart/venn',
        treemap: 'echarts/chart/treemap',
        tree: 'echarts/chart/tree',
        map: 'echarts/chart/map',
        k: 'echarts/chart/k',
        force: 'echarts/chart/force',
        chord: 'echarts/chart/chord',
        gauge: 'echarts/chart/gauge',
        funnel: 'echarts/chart/funnel',
        eventriver: 'echarts/chart/eventRiver',
        wordcloud: 'echarts/chart/wordCloud',
        heatmap: 'echarts/chart/heatmap'
    };

    return echarts;

});


