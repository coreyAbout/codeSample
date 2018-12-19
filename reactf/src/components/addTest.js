import React, { Component } from 'react';
import AddTestMetaContainer from '../containers/addTestMetaContainer';

//Survey editor
import * as SurveyJSEditor from "surveyjs-editor";
import * as SurveyKo from "survey-knockout";
import "surveyjs-editor/surveyeditor.css";

import "jquery-ui/themes/base/all.css";
import "nouislider/distribute/nouislider.css";
import "select2/dist/css/select2.css";
import "bootstrap-slider/dist/css/bootstrap-slider.css";
import 'image-picker/image-picker/image-picker.css';

import "jquery-bar-rating/dist/themes/css-stars.css";
import "jquery-bar-rating/dist/themes/fontawesome-stars.css";

import $ from "jquery";
import "jquery-ui/ui/widgets/datepicker.js";
import "select2/dist/js/select2.js";
import "image-picker/image-picker/image-picker.js";
import "jquery-bar-rating";

import * as widgets from "surveyjs-widgets";

widgets.icheck(SurveyKo, $);
widgets.select2(SurveyKo, $);
widgets.imagepicker(SurveyKo, $);
widgets.inputmask(SurveyKo);
widgets.jquerybarrating(SurveyKo, $);
widgets.jqueryuidatepicker(SurveyKo, $);
widgets.nouislider(SurveyKo);
widgets.select2tagbox(SurveyKo, $);
widgets.signaturepad(SurveyKo);
widgets.sortablejs(SurveyKo);
widgets.ckeditor(SurveyKo);
widgets.autocomplete(SurveyKo, $);
widgets.bootstrapslider(SurveyKo);

class SurveyEditor extends Component {
  editor;
  componentDidMount() {
    let editorOptions = { showEmbededSurveyTab: false, isAutoSave: true };
    this.editor = new SurveyJSEditor.SurveyEditor(
      "surveyEditorContainer",
      editorOptions
    );
    this.editor.text = window.localStorage.getItem("surveyJSON") || ""
    this.editor.saveSurveyFunc = this.saveMySurvey;
  }
  saveMySurvey = () => {
    localStorage.setItem('surveyJSON', this.editor.text)
  };
  render() {
    return <div id="surveyEditorContainer" />;
  }
}

class AddTest extends Component {
  constructor(props){
    super(props);
    this.showMeta = this.showMeta.bind(this)
  }
  showMeta(){
    const testMaterial = {
      testContent: localStorage.getItem('surveyJSON')
    }
    this.props.onClick(testMaterial)
    console.log(JSON.stringify(testMaterial.testContent));
  }
  render() {
    if (this.props.testMetaActive) {
      return (
        <div>
          <br/>
          <br/>
          <AddTestMetaContainer />
          <br/>
          <br/>
        </div>
      )
    } 
    else {
      return (
        <div>
          <br/>
          <button className="btn btn-primary" onClick = {this.showMeta}>Upload survey to server and add meta data for Blockchain storage!</button>
          <div className='text-left'>
            <p className='text-center'><small>Your survey will be automatically saved to the local storage.</small></p>
            <SurveyEditor/>
          </div>
          <br/>
          <br/>
        </div>
      )
    }
  }
}

export default AddTest;