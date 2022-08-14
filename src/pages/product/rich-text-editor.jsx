import React, {Component} from 'react';
import PropTypes from "prop-types";
import {Editor} from 'react-draft-wysiwyg';
import {EditorState, convertToRaw, ContentState} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

//用来编辑商品详情的富文本编辑器
class RichTextEditor extends Component {
    static propTypes = {
        detail: PropTypes.string
    }
    state = {
        editorState: EditorState.createEmpty(),//创建一个没有内容的编辑对象
    }

    render() {
        const {editorState} = this.state;
        return (
            <Editor editorState={editorState}
                    wrapperClassName="demo-wrapper"
                    editorStyle={{border: '1px solid #000000', minHeight: 200, padding: 10}}
                    onEditorStateChange={this.onEditorStateChange}/>
        );
    }

    componentDidMount() {
        this.initEditorState();
    }

    //输入过程中实时的回调
    onEditorStateChange = (editorState) => {
        this.setState({editorState});
    };

    getDetail = () => {
        const {editorState} = this.state;
        return draftToHtml(convertToRaw(editorState.getCurrentContent()));
    }

    initEditorState = () => {
        const htmlDetail = this.props.detail;
        if (htmlDetail) {
            const contentBlock = htmlToDraft(htmlDetail);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                this.setState({editorState});
            }
        }
    }
}

export default RichTextEditor;