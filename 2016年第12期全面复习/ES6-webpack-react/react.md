###React
> React中有两大核心组件：
> - react：核心库 (React)
> - react-dom：提供与DOM相关的功能 (ReactDOM)
>  
> npm install react react-dom --save-dev

####1、JSX和DOM操作

	//->在入口中导入CSS,使用WEB-PACK编译部署
	require('./css/index.css');
	
	//->导入需要的模块(ES6语法)
	import React from 'react';
	import ReactDOM from 'react-dom';
	
	let app = document.getElementById('app');
	let styleObj = {color: 'red'},
	    personList = ['张三', '李四', '王五'];
	
	ReactDOM.render(<h1 style={styleObj} className="title">
	    hello world!
	    <ul>
	        {
	            personList.map((item, index)=> {
	                return <li key={index}>{item}</li>;//->需要给每一个元素设置唯一标识key，存储的值不相同才可以
	            })
	        }
	    </ul>
	</h1>, app);

> JSX：javascript + xml(html) 它是React独有的语法，我们使用这样的语法创建虚拟的DOM，在最后部署打包的时候，基于babel-loader把ES6->ES5，把JSX变为HTML
> - 所有看起来像标签，但不是HTML标签的都是虚拟DOM(React元素)
> - 所有使用 {...}  包起来的都是JS语法
> - 设置样式有两种方式：
>   + 使用行内style来操作  style={styleObj} 我们需要把样式都使用一个变量提前定义
>   + 使用样式类名来操作  className="title"
>    
> 当我们执行ReactDOM.render方法的时候，React会按照上面的机制，把虚拟DOM已经我们编写的JS进行解析，然后把结果插入到app容器中，此时原有的虚拟DOM变为了真实的DOM


####2、React组件
> React的优势就在于组件化的定制，我们可以制定很多的组件，最后一个完整的页面就是由N多个组件组成的，这个也是我们前端工程化开发的意思所在。

#####定义组件

	/*
		使用ES6语法定义组件
		
		1.使用的是ES6中的继承，React.Component就是React的组件类，我们创建的新的组件是Person，我们让其继承React.Component
		
		2.我们自己的定义的组件名，第一个首字母必须大写(React规定)，而且每一个组件有且只能有一个顶级标签
		 
		3.render是规定的方法，在这个方法中返回我们组件的虚拟DOM即可，而对于constructor以及它的参数，我们后续再介绍
	*/
	class Person extends React.Component {
	    constructor(props) {
	        super(props);
	    }
	
	    render() {
	        return <h1 className="title">
	            人员名单
	            <ul>
	                {
	                    personList.map((item, index)=> {
	                        return <li key={index}>{item}</li>;
	                    })
	                }
	            </ul>
	        </h1>;
	    }
	}
	 
	/*
		我们使用ReactDOM.render方法可以把自定义的组件增加到页面指定的容器中，这样虚拟DOM就变为了真实的DOM
	*/
	ReactDOM.render(<Person/>, app);

#####组件的属性
> 属性是一个组件基础信息，在调取组件的时候，由父级组件指定相关的属性值，然后在子组件中，我们只能获取这些属性值，但是不可以修改这些属性值

	class Person extends React.Component {
		//->在构造函数中需要把props这个组件的属性进行继承
	    constructor(props) {
	        super(props);
	    }
	
	    render() {
	        //->我们可以使用 this.props.xxx 来获取传递进来的属性值
	        return <div>
	            {this.props.name}<br/>
	            {this.props.age}<br/>
	            {this.props.sex}
	        </div>;
	    }
	}
	
	//->配置组件属性的默认值或者称之为配置默认属性，在ES5语法中是一个方法：getDefaultProps
	Person.defaultProps = {
	    name: '--',
	    age: 25,
	    sex: 'man'
	};
	
	//->在插入组件到页面容器中的时候，我们根据需求把要求的属性填写上：name="张三" age="30" ... 不填写的按照默认值defaultProps处理即可
	ReactDOM.render(<Person name="张三" age="30"/>, app);


#####this.props.children 
> 在父级组件中导入子组件，我们使用双闭合标签语法，可以在展开的块级区域中创建“子元素”，这些内容都会设定在props.children 上，这样我们就可以在组件中使用这些内容了

	class Person extends React.Component {
	    constructor(props) {
	        super(props);
	    }
	
	    render() {
	        return <div>
	            我的朋友
	            {
	                React.Children.map(this.props.children, (child)=> {
	                    return child;
	                })
	            }
	        </div>;
	    }
	}
	ReactDOM.render(<Person>
	    <span>张三</span>
	    <span>李四</span>
	    <span>王五</span>
	</Person>, app);

#####状态
> 组件的状态就像人的心情，会经常变化，而且只能由自己来改变
> 组件一开始有一个初始状态,然后用户互动,导致状态变化，从而触发界面重新渲染
> 可以给按钮绑定事件，当事件发生的时候调用对应的方法改变组件的状态

	class Person extends React.Component {
	    constructor(props) {
	        super(props);
	        //->设置默认的状态信息
	        this.state = {
	            happy: true
	        }
	    }
	
	    fn(e) {
	        //->重新设置state值
	        this.setState({
	            happy: !this.state.happy
	        });
	    }
	
	    render() {
	        var happyState = this.state.happy ? 'good' : 'bad';
	        return <div>
	            today is {happyState} day!
	            <input type="button" value="change" onClick={this.fn.bind(this)}/>
	            //->ES6中的一个坑：一定要重新的bind(this)，这样在方法中的this才代表这个组件，否则代表的是当前点击的这个元素
	        </div>;
	    }
	}
	ReactDOM.render(<Person/>, app);

> 剪贴板事件 onKeyDown onKeyPress onKeyUp
> 键盘事件 onFocus onBlur
> 焦点事件 onChange onInput onSubmit
> 鼠标事件 onClick onDoubleClick onMouseDown onMouseEnter onMouseLeave

#####表单元素双向数据绑定 
	class Person extends React.Component {
	    constructor(props) {
	        super(props);
	        this.state = {
	            value: 0
	        };
	    }
	
	    handleChange(e) {
	        this.setState({
	            value: e.target.value
	        });
	    }
	
	    render() {
	        var value = this.state.value;
	        return <div>
	            <input style={{color: 'red'}} type="text"
	                   value={value} onChange={this.handleChange.bind(this)}/>
	            <p>{value}</p>
	        </div>;
	    }
	}
	ReactDOM.render(<Person/>, app);
> 如果给表单元素设置了value属性，则必须指定onChange事件处理函数，否则 此字段会变成只读状态

#####复合组件 
> 多个简单的组件嵌套，可构成一个复杂的复合组件，从而完成复杂的交互逻辑

	class Panel extends React.Component {
	    render() {
	        return <div className="panel panel-default">
	            <PanelHead head={this.props.head}/>
	            <PanelBody body={this.props.body}/>
	        </div>;
	    }
	}
	class PanelHead extends React.Component {
	    render() {
	        return <div className="panel-heading">
	            {this.props.head}
	        </div>;
	    }
	}
	class PanelBody extends React.Component {
	    render() {
	        return <div className="panel-body">
	            {this.props.body}
	        </div>;
	    }
	}
	ReactDOM.render(<Panel head="头部" body="正文"/>, app);

#####DOM操作 
> 给组件加上ref="xxx"后，可在父组件中通过this.refs.xxx获取该DOM元素

	class Panel extends React.Component {
	    handleClick(e) {
	        this.refs.msg.focus();
	    }
	
	    render() {
	        return <div>
	            <input type="text" ref="msg"/>
	            <input type="button" value="获得焦点"
	                   onClick={this.handleClick.bind(this)}/>
	        </div>;
	    }
	}
	ReactDOM.render(<Panel/>, app);