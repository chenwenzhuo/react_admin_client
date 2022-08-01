import React, {Component} from 'react';

import './Header.less';

class Header extends Component {
    render() {
        return (
            <div className='header'>
                <div className="header-top">
                    <span>欢迎，admin</span>
                    <button>退出</button>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">首页</div>
                    <div className="header-bottom-right">
                        <span className="header-bottom-right-time">2022-8-1&nbsp;21:35:58</span>
                        <img src="https://api.map.baidu.com/images/weather/day/qing.png" alt="weather"/>
                        <span className="header-bottom-right-weather">晴</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default Header;