
require('./search.css');
import React from 'react'; 

let Search = React.createClass({
	render: function() {
		return (
			<div id="search" className="pf"  style={{ background: 'blue' }}>
				<div className="search pr">
					<div className="sl pa">
						<i></i>
					</div>
					<div className="frc pr">
						<span className="searchicon pa"></span>
						<form>
							<input placeholder="全场畅饮，部分低至99减50" type="text"/>
						</form>
					</div>
					<div className="sub pa">
						<span>登录</span>
					</div>
				</div>
			</div>
		);
	}
})

module.exports = Search;