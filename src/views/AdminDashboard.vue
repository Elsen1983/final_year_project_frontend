<template>
    <div id="adminDashboardContainer">
        <!-- Content here -->
        <b-row id="dashboardHeader" style="border-bottom: 2px black solid; padding-left: 2vmax; height: 5vh" align-v="center">
            <b-col md="6">
                <strong style="font-size: 1vmax;">Admin Dashboard [</strong> <span style="font-size: 0.8vmax;">{{currentUser.name}}</span><strong style="font-size: 1vmax;">]</strong>
            </b-col>
            <b-col md="6"></b-col>
        </b-row>
        <b-row id="dashboardOpenSearchSlideBar" class="pt-1 pb-1" align-v="center" style="padding-left: 2vmax; padding-right: 2vmax; border-bottom: 2px black solid;">
            <b-col md="3">
                <b-button v-b-toggle.sidebar-no-header variant="warning" class="mt-1 mb-1"
                          style="border: 1px solid black"
                          @click="callSearch()"><strong style="font-size: 0.8vmax;">Searching parameters</strong></b-button>
            </b-col>
            <b-col md="3"></b-col>
            <b-col cols="1" class="mt-1 mb-1 text-center"><strong style="text-align: right;">Theme</strong></b-col>
            <b-col cols="3">
                <b-form-select v-model="themeSelector" @change="onchangeTheme()" class="form-control form-control-sm mt-1 mb-1">
                    <!-- This slot appears above the options from 'options' prop -->
                    <option :value="undefined" disabled style="display:none">-- Please select a theme --</option>
                    <!-- These options will appear after the ones from 'options' prop -->
                    <option :key="index" :value="t" v-for="(t, index) in variants">{{t}}</option>
                </b-form-select>
            </b-col>
            <b-col md="2"></b-col>

        </b-row>
        <b-row id="dashboardBody">
            <template>
                <div id="visualizationArea">
                    <!-- Card without body -->
                    <b-card no-body class="mt-0">
                        <!-- Tabs container (card) -->
                        <b-tabs card>

                            <b-tabs
                                    active-nav-item-class="font-weight-bold text-uppercase text-danger"
                                    active-tab-class="font-weight-bold text-dark"
                                    content-class="mt-3"
                                    id="tabs"
                            >
                                <!-- Tab 1 - Graphs-->
                                <b-tab id="tabOne" active>
                                    <template v-slot:title id="graphsTab">
                                        <b-img id="barChartIcon" width="40px" fluid
                                               src="../assets/barchart_icon_white.png" alt="Image 1"></b-img>
                                        <strong>Graph based Visualization</strong>
                                    </template>

                                    <b-row class="mt-0 pt-0 pb-1" style="padding-left: 2vmax; padding-right: 2vmax;">
                                        <b-col md="1"></b-col>
                                        <b-col md="1" >
                                                <la-cartesian :data="values" :bound="[0]" :width="80" :height="80" class="smallChart justify-content-center" >
                                                    <la-bar animated prop="value" :width="10"></la-bar>
                                                </la-cartesian>
                                        </b-col>
                                        <b-col md="1">
                                                <la-cartesian :data="values" :bound="[0]" :width="80" :height="80" class="smallChart justify-content-center">
                                                    <la-line animated prop="value" :width="2"></la-line>
                                                </la-cartesian>
                                        </b-col>
                                        <b-col md="1">
                                                <la-polar :data="values" fillContainer :width="75" class="smallChart justify-content-center">
                                                    <la-pie animated prop="value" ></la-pie>
                                                </la-polar>
                                        </b-col>

                                        <b-col md="8"></b-col>

                                    </b-row>
                                    <b-row style="padding-left: 2vmax; padding-right: 2vmax; text-align:left;">
                                        <b-col md="1"></b-col>
                                        <b-col md="1"><b-button variant="primary" @click="changeChart('bar', reducedObjectArrayForList)">Bar Chart</b-button></b-col>
                                        <b-col md="1"><b-button variant="primary" @click="changeChart('line',reducedObjectArrayForList)" >Line Chart</b-button></b-col>
                                        <b-col md="1"><b-button variant="primary" @click="changeChart('pie', reducedObjectArrayForList)" >Pie Chart</b-button></b-col>
                                        <b-col md="8"></b-col>
                                    </b-row>

                                    <b-row>
                                        <b-col md="1"></b-col>
                                        <b-col md="8" id="chartsArea">
                                            <b-card id="visualizationMainArea " class="visualizationMainArea "
                                                    >
                                                <b-row>
                                                    <b-col md="1">
                                                    </b-col>
                                                    <b-col md="8">
                                                        <section id="chartArea">
                                                            <b-img fluid src="../assets/datavisualization.png"
                                                                   alt="Image 1"></b-img>
                                                        </section>
                                                    </b-col>
                                                    <b-col md="2">
                                                    </b-col>
                                                    <b-col md="1">
                                                    </b-col>
                                                </b-row>
                                                <b-row>
                                                    <b-col md="1"></b-col>
                                                    <b-col md="8">
                                                        <b-button v-if="showDownloads === true" style="width: 720px; margin: 1em;"
                                                                  class="btn btn-warning btn-block downloadBTN"
                                                                  @click="print('bar')"><strong>Download to PDF</strong>
                                                        </b-button>
                                                    </b-col>
                                                    <b-col md="3"></b-col>
                                                </b-row>
                                            </b-card>
                                        </b-col>
                                        <b-col md="2">
                                            <b-card no-body id="dateListArea" v-if="showDownloads === true" class="cardWithDates mb-1" header="Selected dates">
                                                <b-card-text text="black" class="detailsText">For more details click
                                                    on it.
                                                </b-card-text>
                                                <b-card-header header-tag="header" class="p-1" role="tab"
                                                               v-for="(item, idx) in reducedObjectArrayForList"
                                                               :key="idx">
                                                    <b-button block v-b-toggle="'accordion-' + idx" variant="info">
                                                        {{item.timestamp}}
                                                    </b-button>
                                                    <b-collapse :id="'accordion-' + idx" :accordion="'my-accordion'"
                                                                role="tabpanel">
                                                        <b-card-body class="detailsCardBody">
                                                            <b-card-text>Selected date: <strong>{{item.timestamp}}</strong>.
                                                            </b-card-text>
                                                            <b-card-text>{{selectedActionType.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); })}} happened
                                                                <strong>{{item.count}}</strong> time(s) on this
                                                                date.
                                                            </b-card-text>
                                                        </b-card-body>
                                                    </b-collapse>
                                                </b-card-header>
                                            </b-card>
                                        </b-col>
                                        <b-col md="1"></b-col>
                                    </b-row>
                                </b-tab>
                                <!-- Tab 2 - Tables-->
                                <b-tab id="tabTwo">
                                    <template v-slot:title class="tableTab">
                                        <b-img id="lineChartIcon" width="40px" fluid
                                               src="../assets/linechart_icon_white.png" alt="Image 1"></b-img>
                                        <strong>Table based Visualization</strong>
                                    </template>
                                    <b-card class="visMainArea justify-content-md-center text-center"
                                            align-v="center">
                                        <b-row no-gutters>
                                            <b-col md="1">
                                            </b-col>
                                            <b-col md="10">
                                                <section id="tableChartVis">
                                                    <b-img fluid src="../assets/datavisualization.png"
                                                           alt="Image 1"></b-img>
                                                </section>
                                            </b-col>
                                            <b-col md="1">
                                            </b-col>
                                        </b-row>
                                        <b-row>
                                            <b-col md="1"></b-col>
                                            <b-col md="10">
                                                <b-button v-if="showDownloads===true" style="width: 720px; margin: 1em;"
                                                          class="btn btn-warning btn-block downloadBTN"
                                                          @click="print('line')"><strong>Download to PDF</strong>
                                                </b-button>
                                            </b-col>
                                            <b-col md="3"></b-col>
                                        </b-row>
                                    </b-card>
                                </b-tab>
                            </b-tabs>

                        </b-tabs>

                    </b-card>

                </div>
            </template>
        </b-row>

        <!--         SIDEBAR FOR SEARCHING PARAMETERS           -->
        <b-sidebar id="sidebar-no-header" aria-labelledby="sidebar-no-header-title" title="Search Parameters"
                   sidebar-class="border-right border-warning" bg-variant="dark" text-variant="light"
                   width="30vw" height="100vh"
        >
            <template v-slot:default="{ hide }">
                <form name="form" @submit.prevent="submitSearchByParameters" class="mt-2em">
                    <hr class="hr-separators">
                    <div class="p-3">
                        <b-row class="mt-4">
                            <b-col cols="12">Please select the options below for visualize your data.</b-col>
                        </b-row>

                        <b-row class="mt-4">
                            <b-col cols="6">Type of action</b-col>
                        </b-row>
                        <b-row>
                            <b-col cols="6">
                                <b-form-select id="actionSelector"
                                               @change="onchangeActionType()"
                                               v-model="selectedActionType"
                                               :options="actionTypes"
                                               class="form-control form-control-sm">
                                    <option :value="undefined" disabled style="display:none">Select type of action</option>
                                </b-form-select>

                            </b-col>
                            <b-col md="3">
                                <button id="submitActionBTN" class="btn btn-success" disabled @click="submitActionType">
                                    <span>Confirm</span>
                                </button>
                            </b-col>
                            <b-col md="3">
                                <button id="resetActionBTN" class="btn btn-danger" disabled @click="resetActionType">
                                    <span>Reset</span>
                                </button>
                            </b-col>
                        </b-row>

                        <b-row class="mt-4">
                            <b-col cols="6">Date FROM</b-col>
                            <b-col cols="6">Date TO</b-col>
                        </b-row>
                        <b-row>
                            <b-col cols="6">
                                <b-form-select id="dateFromSelector"
                                               @change="onchangeDateFrom()"
                                               class="form-control form-control-sm"
                                               v-model="dateFrom"
                                               disabled
                                >
                                    <option :value="undefined" disabled style="display:none">Select date FROM</option>
                                    <option :key="index" :value="t" v-for="(t, index) in timeSelectFrom">{{t}}</option>
                                </b-form-select>
                            </b-col>
                            <b-col cols="6">
                                <b-form-select id="dateToSelector"
                                               @change="onchangeDateTo()"
                                               class="form-control form-control-sm"
                                               v-model="dateTo"
                                               disabled
                                >
                                    <option :value="undefined" disabled style="display:none">Select date TO</option>
                                    <option :key="index" :value="t" v-for="(t, index) in timeSelectTo">{{t}}</option>
                                </b-form-select>
                            </b-col>
                        </b-row>
                        <!--                                    <div class="mb-3" v-if="timeSelected !== undefined && timeSelected.length !== 0 "><strong>Selected date(s):</strong> {{ timeSelected.join(" - ") }}</div>-->


                        <b-row class="mt-4 mb-2">
                            <b-col cols="12">After selected the visualization parameters, please press the "Submit"
                                button.
                            </b-col>
                        </b-row>
                        <hr class="hr-separators">
                        <button id="submitSearchBTN"
                                @click="hide"
                                disabled
                                class="btn btn-success btn-block mt-2"
                        >
                            <span class="spinner-border spinner-border-sm" v-show="submit"></span>
                            <span>Submit Search</span>
                        </button>
                        <!--                                    <b-button variant="primary" block @click="hide">Close Sidebar</b-button>-->
                    </div>
                </form>
                <div class="d-flex bg-dark text-light align-items-right px-3 py-2" id="sidebarCloseBTN">
                    <b-button class="btn btn-warning btn-block" @click="hide">Close</b-button>
                </div>
            </template>

        </b-sidebar>
    </div>
</template>
<script>
    import AdminService from '../services/admin.service';
    import UserService from "../services/user.service";
    import * as d3 from "d3";
    import * as jsPDF from "jspdf";
    import html2canvas from "html2canvas";
    import User from "../models/user";
    // eslint-disable-next-line no-unused-vars
    import { Cartesian, Line, Bar, Polar, Pie, XAxis, YAxis } from 'laue'

    export default {
        name: 'admindashboard',
        components: {
            LaCartesian: Cartesian,
            LaLine: Line,
            LaBar: Bar,
            LaPolar: Polar,
            LaPie: Pie
        },
        data() {
            return {
                values: [
                    { value: 10 },
                    { value: 16 },
                    { value: 5 },
                    { value: 25 },
                    { value: 12 },
                    { value: 17 },
                ],

                currentUser: new User('','','','',''),

                //userList: [],

                //theme selectors
                variants: ['Light (Default)','Dark'],
                themeSelector: undefined,
                //type
                actionTypes: ['All', 'Editing', 'Login', 'Page access','Report', 'Simulation', 'Validation'],
                selectedActionType: undefined,
                allDataBySelectedType: [],
                //date From
                dateFrom: undefined,
                dateTo: undefined,
                timeSelectFrom: [],
                timeSelectTo: [],
                timeSelected: [],
                submit: '',


                reducedObjectArrayForList: [],
                dataforCharts: [],
                showDownloads: false,

                keyAndValueSelectedDatesObjectsArray: []

            };
        },
        beforeCreate() {

        },
        created() {
            this.currentUser = UserService.currentUserValue;
            if (!this.currentUser) {
                this.$router.push('/login');
            }

        },
        mounted() {
            // Register an event listener when the Vue component is ready
            window.addEventListener('resize', this.onResize);
            window.addEventListener('load', this.onResize);

        },
        beforeDestroy() {
            // Unregister the event listener before destroying this Vue instance
            window.removeEventListener('resize', this.onResize);
            window.removeEventListener('load', this.onResize);
        },

        computed: {

        },
        methods: {

            // eslint-disable-next-line no-unused-vars
            onResize(event) {
                //console.log('window has been resized', event)
                let visualizationMainArea  = document.getElementById('visualizationMainArea ').firstElementChild;

                let chartsAreaHeight = 0;
                chartsAreaHeight= visualizationMainArea.offsetHeight;
                //console.log(chartsAreaHeight);

                let dateListAreaHeight = chartsAreaHeight.toString() + 'px';
                //console.log(dateListAreaHeight);
                let dateListArea = document.getElementById('dateListArea');
                if(dateListArea !== null){
                    dateListArea.style.height = dateListAreaHeight;
                }


            },

            loadPage(){
                this.dateFrom= undefined;
                this.dateTo= undefined;
                this.actionType = undefined;

                this.themeSelector = undefined;

                this.keyAndValueSelectedDatesObjectsArray = [];
                this.reducedObjectArrayForList = [];

                this.themeChanger(
                    "#e7e6e6",
                    '#000000',
                    '#ffffff',
                    '#000000',
                    '#efefef',
                    '#000000',
                    '#000000',
                    "https://i.ibb.co/0MMPNK4/barchart-icon.png",
                    "https://i.ibb.co/C8fpxfT/linechart-icon.png",
                    "https://i.ibb.co/bzqNWb9/piechart-icon.png",
                    'rgba(241,240,240,0.61)',
                    '#e2e2e2');

                this.showDownloads = false;

            },

            logOut() {
                UserService.logOut().then(() => {
                    console.log("LOG OUT")
                    this.$router.push('/login');
                });
            },

            //  for opening the Sidebar and make the form selectable
            callSearch(){

                //  if the form was not filled out fully before or never submitted (so 'close' button used)
                if(this.selectedActionType !== undefined){
                    document.getElementById('actionSelector').removeAttribute("disabled");
                    document.getElementById('submitActionBTN').removeAttribute('disabled');
                    document.getElementById('resetActionBTN').setAttribute("disabled", "disabled");

                    //  reset date selectors
                    document.getElementById('dateFromSelector').setAttribute("disabled", "disabled");
                    document.getElementById('dateToSelector').setAttribute("disabled", "disabled");
                    this.dateFrom = undefined;
                    this.dateTo = undefined;
                    this.timeSelectFrom = undefined;
                    this.timeSelectTo = undefined;
                    this.timeSelected = undefined;

                    //  cancel possibility of submit the form
                    document.getElementById('submitSearchBTN').setAttribute("disabled", "disabled");

                }

            },

            //  for theme selection
            //methods for the changing of the page elements
            onchangeTheme(){
                console.log(this.themeSelector + " Theme selected");

                ///img/barchart_icon.7cae0ef1.png
                //  barChartIcon src --> black:https://i.ibb.co/0MMPNK4/barchart-icon.png    white: https://i.ibb.co/R79cBq0/barchart-icon-white.png
                //  lineChartIcon src --> black: https://i.ibb.co/C8fpxfT/linechart-icon.png white: https://i.ibb.co/GsGZxCQ/linechart-icon-white.png
                //  pieChartIcon src --> black: https://i.ibb.co/bzqNWb9/piechart-icon.png white: https://i.ibb.co/n8qCmDs/piechart-icon-white.png

                switch (this.themeSelector) {
                    case "Light (Default)":
                        this.themeChanger(
                            "#e7e6e6",
                            '#000000',
                            '#ffffff',
                            '#000000',
                            '#efefef',
                            '#000000',
                            '#000000',
                            "https://i.ibb.co/0MMPNK4/barchart-icon.png",
                            "https://i.ibb.co/C8fpxfT/linechart-icon.png",
                            "https://i.ibb.co/bzqNWb9/piechart-icon.png",
                            'rgba(241,240,240,0.61)',
                            '#e2e2e2');
                        break;
                    case "Dark":
                        this.themeChanger(
                            "#2B3C43",
                            '#ffffff',
                            '#4D4D4F',
                            '#ffffff',
                            '#868686',
                            '#000000',
                            '#fcfcfc',
                            "https://i.ibb.co/R79cBq0/barchart-icon-white.png",
                            "https://i.ibb.co/GsGZxCQ/linechart-icon-white.png",
                            "https://i.ibb.co/n8qCmDs/piechart-icon-white.png",
                            'rgba(134,134,134,0.61)',
                            'rgb(162 162 162)');
                        break;
                    default:
                    // code block
                }

            },

            themeChanger(modal_header, modal_header_text, modal_body, modal_body_text, tabs_area, tabs_area_border,
                         tab_area_text, barChart_icon_color, lineChart_icon_color, pieChart_icon_color,
                         tab_controls, tab_car_header_body) {
                setTimeout(function(){
                    document.getElementById('modal-xl___BV_modal_header_').style.backgroundColor = modal_header;
                    document.getElementById('modal-xl___BV_modal_header_').style.color = modal_header_text;
                    document.getElementById('modal-xl___BV_modal_body_').style.backgroundColor = modal_body;
                    document.getElementById('modal-xl___BV_modal_body_').style.color = modal_body_text;
                    let tabs_li = document.querySelectorAll('#tabsArea__BV_tab_controls_ li');
                    for(let i = 0; i<tabs_li.length; i++){
                        tabs_li[i].style.backgroundColor = tabs_area;
                        tabs_li[i].style.border = '1px solid' + tabs_area_border;
                    }
                    let tabs_li_a = document.querySelectorAll('#visArea a');
                    for(let i = 0; i<tabs_li_a.length; i++){
                        tabs_li_a[i].style.color = tab_area_text;
                    }

                    //tabsArea__BV_tab_container_
                    let tabPanel= document.getElementById('tabsArea__BV_tab_container_').firstElementChild;
                    tabPanel.style.backgroundColor = tab_car_header_body;

                    document.getElementById('barChartIcon').setAttribute('src', barChart_icon_color)
                    document.getElementById('lineChartIcon').setAttribute('src', lineChart_icon_color)
                    document.getElementById('pieChartIcon').setAttribute('src', pieChart_icon_color)
                    document.getElementById('tabsArea__BV_tab_controls_').style.backgroundColor = tab_controls;
                    document.getElementById('tabsArea__BV_tab_controls_').style.borderBottom = '1px solid' + tabs_area_border;


                    let visArea = document.getElementById('visArea');
                    let cardHeader = visArea.firstElementChild.firstElementChild;
                    cardHeader.style.backgroundColor = tab_car_header_body;
                    cardHeader.style.border = '1px solid' + tabs_area_border;

                    let tabs_body = document.getElementsByClassName('tab-content');
                    for(let i = 0; i<tabs_body.length; i++){
                        tabs_body[i].style.backgroundColor = tab_car_header_body;
                    }
                }, 500)


            },

            //  for select action
            onchangeActionType(){

                document.getElementById('submitActionBTN').removeAttribute('disabled');

            },

            //submit the form and send the request to the server based on the selected data
            async submitActionType(){

                this.allDataBySelectedType.length = 0;

                document.getElementById('actionSelector').setAttribute("disabled", "disabled");
                document.getElementById('submitActionBTN').setAttribute("disabled", "disabled");

                let actionTypeReduced = this.selectedActionType.replace(/\s+/g, '').toLowerCase()
                console.log("REQUEST TYPE: " + actionTypeReduced);

                await AdminService.findAllByType(actionTypeReduced);

                this.allDataBySelectedType = AdminService.dataByCalledTypeDataValue;

                //console.log(this.allDataBySelectedType);

                document.getElementById('resetActionBTN').removeAttribute("disabled");

                this.getDatesForSelection();

                //compare the object arrays and find the same elements in both based on timestamp key
                //let result = UserService.currentUserVisualizationDataValue.filter(o1 => this.selectedObjectsBeforeActionTypeSelection.some(o2 => o1.timestamp === o2.timestamp));
                //To get unique elements instead of the common ones, change the last line to let result = arr1.filter(o1 => !arr2.some(o2 => o1.id === o2.id)); to return the opposite value

            },


            resetActionType(){

                //  reset the 'Action Type' selector and status of the Confirm + Reset buttons
                this.selectedActionType = undefined;
                document.getElementById('resetActionBTN').setAttribute("disabled", "disabled");
                document.getElementById('submitActionBTN').removeAttribute("disabled");
                document.getElementById('actionSelector').removeAttribute("disabled");

                // reset date selectors and arrays used by them
                document.getElementById('dateFromSelector').setAttribute("disabled", "disabled");
                document.getElementById('dateToSelector').setAttribute("disabled", "disabled");
                this.dateFrom = undefined;
                this.dateTo = undefined;
                this.timeSelectFrom = undefined;
                this.timeSelectTo = undefined;
                this.timeSelected = undefined;

                //  cancel possibility of submit the form
                document.getElementById('submitSearchBTN').setAttribute("disabled", "disabled");
            },

            getDatesForSelection(){

                // dates From
                let timesFrom = [];
                let date = "";
                timesFrom.push("All Date");
                this.allDataBySelectedType.forEach(obj => {
                    Object.entries(obj).forEach(([key, value]) => {

                        if (key === 'timestamp') {
                            date = value.split(" ");

                            if (timesFrom.indexOf(date[0]) === -1) {
                                timesFrom.push(date[0]);
                            }
                        }
                    });
                });

                this.timeSelectFrom = [...timesFrom];
                //console.log("timeSelectFrom -> " + this.timeSelectFrom);

                document.getElementById('dateFromSelector').removeAttribute("disabled");
            },

            onchangeDateFrom(){

                this.dateTo = undefined;
                this.timeSelectTo = undefined;
                this.timeSelected = undefined;

                //  selected dateFrom is not 'All Date' and not the last date from the list
                if(this.dateFrom !== "All Date" && this.dateFrom !== this.timeSelectFrom[this.timeSelectFrom.length -1]){
                    document.getElementById('dateToSelector').removeAttribute("disabled");
                    document.getElementById('submitSearchBTN').setAttribute("disabled", "disabled");

                    let index = this.dateFrom;
                    let fromDateSelected = this.timeSelectFrom.indexOf(index);
                    let newArray = [];
                    for (let i = fromDateSelected - 1; i < this.timeSelectFrom.length; i++) {
                        newArray.push(this.timeSelectFrom[i]);
                    }
                    this.timeSelectTo = [...newArray.slice(1)];
                    //after this user must select one from dropdown for timeSelectTo
                }
                //  selected dateFrom is 'All Date' or the last date from the list
                else{

                    document.getElementById('dateToSelector').setAttribute("disabled", "disabled");
                    document.getElementById('submitSearchBTN').removeAttribute('disabled');

                    //if last date selected
                    if(this.dateFrom === this.timeSelectFrom[this.timeSelectFrom.length -1]){
                        let newArray = [];
                        newArray.push(this.timeSelectFrom[this.timeSelectFrom.length -1]);
                        this.timeSelected = [...newArray];
                    }
                    //if 'All Date' selected
                    else{
                        this.timeSelected = [...this.timeSelectFrom.slice(1)];
                    }

                    // make to able select the 'Submit Search' button
                    document.getElementById('submitSearchBTN').removeAttribute("disabled");
                }


            },

            onchangeDateTo(){
                //  logic:  get the elements from timeSelectFrom where the elements are equal with the'dateFrom'
                //  and all after that until element which equal with 'dateTo'
                let dateFromArray = [];
                let indexFrom = this.timeSelectFrom.findIndex(index => index === this.dateFrom);
                console.log(indexFrom);
                let indexTo= this.timeSelectFrom.findIndex(index => index === this.dateTo);
                console.log(indexTo);

                dateFromArray = [...this.timeSelectFrom.slice(indexFrom,indexTo+1)]
                this.timeSelected = [...dateFromArray]

                document.getElementById('submitSearchBTN').removeAttribute("disabled");
            },

            //  for submit all searching parameters to generate visualization
            submitSearchByParameters(){
                //  get objects from 'allDataBySelectedType' where the timestamp is in the selected range from 'timeSelected'
                let selectedObjects = [];
                let date = "";
                this.allDataBySelectedType.forEach(obj => {
                    Object.entries(obj).forEach(([key, value]) => {

                        if (key === 'timestamp') {
                            date = value.split(" ");

                            if (this.timeSelected.indexOf(date[0]) !== -1) {
                                console.log(date[0])
                                selectedObjects.push(obj);
                            }
                        }
                    });
                });

                this.calculateVisualizationData(selectedObjects)
            },

            calculateVisualizationData(resultObjectsArray){

                this.keyAndValueSelectedDatesObjectsArray.length = 0;
                //get all dates without 'All Dates'
                let allDates = [...this.timeSelected];
                //create an objects array with all the dates(timestamp) and count(value) them with 0
                for (let i=0; i< allDates.length; i++){
                    let obj = {};
                    let timestamp = allDates[i];
                    let count = 0;
                    obj.timestamp = timestamp;
                    obj.count = count;
                    this.keyAndValueSelectedDatesObjectsArray.push(obj);
                }

                for(let i = 0; i<this.keyAndValueSelectedDatesObjectsArray.length; i++){
                    delete this.keyAndValueSelectedDatesObjectsArray[i]['date'];
                    delete this.keyAndValueSelectedDatesObjectsArray[i]['value'];
                    for(let j = 0; j<resultObjectsArray.length; j++) {
                        let date = "";
                        date = resultObjectsArray[j].timestamp.split(" ");
                        if(this.keyAndValueSelectedDatesObjectsArray[i].timestamp === date[0]){
                            this.keyAndValueSelectedDatesObjectsArray[i].count++;
                        }
                    }
                }
                this.dataforCharts = [...this.keyAndValueSelectedDatesObjectsArray];
                //reduce the dataset with key 'count' where value is 0
                this.reducedObjectArrayForList = [...this.dataforCharts].filter(function(e) { return e.count !== 0; });
                //when data ready make some changes on UI
                this.clearSVGCharts();
            },

            //------------------------------------------------------------------------------

            changeChart(text, data){

                let chartData = [];
                for(let i = 0; i<data.length; i++){
                    chartData.push(data[i]);
                }

                console.log(chartData)

                if(text === 'bar'){
                    this.clearSVGCharts();
                    this.setupGraphsBarChart(chartData);
                    this.showDownloads = true;

                }
                if(text === 'line'){
                    this.clearSVGCharts();
                    this.setupGraphsLineChart(chartData);
                    this.showDownloads = true;

                }
                if(text === 'line'){
                    this.clearSVGCharts();
                    this.setupGraphsPieChart(chartData)
                    this.showDownloads = true;

                }
            },

            clearSVGCharts(){
                let chart = document.getElementById("chartArea");
                //let lineChart = document.getElementById("lineChartVis");
                //let pieChart = document.getElementById("pieChartVis");

                if(chart.hasChildNodes() ===true){
                    chart.removeChild(chart.childNodes[0]);
                }
                // if(lineChart.hasChildNodes() ===true){
                //     lineChart.removeChild(lineChart.childNodes[0]);
                // }
                // if(pieChart.hasChildNodes() ===true){
                //     pieChart.removeChild(pieChart.childNodes[0]);
                // }
            },


            // --- Bar Chart ---
            setupGraphsBarChart(data){
                //console.log('BarChart incoming data:' + data);
                let maxcount = 0;
                for(let i=0; i<data.length; i++){
                    if(data[i].count > maxcount){
                        maxcount = data[i].count;
                    }
                }
                // chart dimensions
                let margin = {top: 40, right: 40, bottom: 100, left: 40};
                let width = 800 - margin.left - margin.right;
                let height = 600 - margin.top - margin.bottom;
                let default_ratio = width / height;

                // Determine current size to make the chart to responsive
                function set_size() {
                    let h =0;
                    let w =0;

                    let current_width = window.innerWidth;
                    let current_height = window.innerHeight;
                    let current_ratio = current_width / current_height;

                    // desktop ratio
                    if (current_ratio > default_ratio) {
                        h = height;
                        w = width;
                    }
                    // mobile
                    else {
                        w = current_width;
                        h = w / default_ratio;
                    }
                    // Set new width and height taking margin into account
                    width = w - margin.left - margin.right;
                    height = h - margin.top - margin.bottom;
                }

                set_size();

                // Scale the range of the data in the domains
                // Set the ranges
                let xScale = d3.scaleBand()
                    .domain(data.map(function(d) { return d.timestamp; }))
                    .range([0, width])
                    .padding(0.2);

                let yScale = d3.scaleLinear()
                    .domain([0, d3.max(data, function(d) { return d.count; })])
                    .range([height, 0]);

                // append the svg object to the body of the page
                // append a 'group' element to 'svg'
                // moves the 'group' element to the top left margin
                let svg = d3.select("#chartArea").append("svg")
                    .attr("id", "barChartSVG")
                    .attr("style",
                        "-webkit-box-shadow: 9px 10px 22px 1px rgba(0,0,0,0.58);" +
                        "-moz-box-shadow: 9px 10px 22px 1px rgba(0,0,0,0.58);" +
                        "box-shadow: 9px 10px 22px 1px rgba(0,0,0,0.58);" +
                        "outline: thin solid black;")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    // .style('background', '#bce8f1')
                    .append("g")
                    .attr('class', 'bar_g')
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");

                // append the rectangles for the bar chart
                svg.selectAll(".bar")
                    .data(data)
                    .enter().append("rect")
                    .attr("class", "bar")
                    .style("fill", "#319bbe")
                    .attr("x", function(d) { return xScale(d.timestamp); })
                    .attr("width", xScale.bandwidth())
                    .attr("y", function(d) { return yScale(d.count); })
                    .attr("height", function(d) { return height - yScale(d.count); });

                // add the x Axis
                svg.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(xScale))
                    .selectAll("text")
                    .attr("y", 0)
                    .attr("x", 9)
                    .attr("dy", ".35em")
                    .attr("transform", "rotate(65)")
                    .style("text-anchor", "start");
                // add the y Axis
                svg.append("g")
                    .call(d3.axisLeft(yScale));

                this.onResize();
            },

            // --- Line Chart ---
            setupGraphsLineChart(data){

                console.log('BarChart incoming data:' + data);

                for(let i =0; i<data.length; i++){
                    let date = '';
                    date = data[i].timestamp;
                    data[i].timestamp = new Date(date);
                }

                let maxcount = 0;
                for(let i=0; i<data.length; i++){
                    if(data[i].count > maxcount){
                        maxcount = data[i].count;
                    }
                }

                // chart dimensions
                let margin = {top: 40, right: 40, bottom: 100, left: 40};
                let width = 800 - margin.left - margin.right;
                let height = 600 - margin.top - margin.bottom;
                let default_ratio = width / height;


                // Determine current size, which determines vars
                // Determine current size, which determines vars
                function set_size() {
                    let h =0;
                    let w =0;

                    let current_width = window.innerWidth;
                    let current_height = window.innerHeight;
                    let current_ratio = current_width / current_height;

                    // desktop ratio
                    if (current_ratio > default_ratio) {
                        h = height;
                        w = width;
                    }
                    // mobile
                    else {
                        w = current_width;
                        h = w / default_ratio;
                    }
                    // Set new width and height taking margin into account
                    width = w - margin.left - margin.right;
                    height = h - margin.top - margin.bottom;
                }

                set_size();


                let svg = d3.select('#chartArea').append("svg")
                    .attr("id", "lineChartSVG")
                    .attr("style",
                        "-webkit-box-shadow: 9px 10px 22px 1px rgba(0,0,0,0.58);" +
                        "-moz-box-shadow: 9px 10px 22px 1px rgba(0,0,0,0.58);" +
                        "box-shadow: 9px 10px 22px 1px rgba(0,0,0,0.58);" +
                        "outline: thin solid black;")
                    .attr("width",  width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                // set the ranges
                let x = d3.scaleTime().range([0, width]);

                // x.domain(d3.extent(data, function(d) { return d.timestamp; }));
                x.domain(d3.extent(data, function(d) { return d.timestamp; }));

                let y = d3.scaleLinear().range([height, 0]);

                y.domain([0, maxcount]);


                var valueline = d3.line()
                    .x(function(d) { return x(d.timestamp); })
                    .y(function(d) { return y(d.count);  })
                    .curve(d3.curveLinear);

                svg.append("path")
                    .data([data])
                    .attr("class", "line")
                    .style("fill", "none")
                    .style("stroke", "#0246cd")
                    .style("stroke-width", "3")
                    .attr("d", valueline);

                //  var xAxis_woy = d3.axisBottom(x).tickFormat(d3.timeFormat("Week %V"));
                var xAxis_woy = d3.axisBottom(x).ticks(20).tickFormat(d3.timeFormat("%Y-%m-%d")).tickValues(data.map(d=>d.timestamp));

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis_woy)
                    .selectAll("text")
                    .attr("y", 0)
                    .attr("x", 9)
                    .attr("dy", ".35em")
                    .attr("transform", "rotate(65)")
                    .style("text-anchor", "start");

                //  Add the Y Axis
                svg.append("g").call(d3.axisLeft(y));

                svg.selectAll(".dot")
                    .data(data)
                    .enter()
                    .append("circle") // Uses the enter().append() method
                    .attr("class", "dot") // Assign a class for styling
                    .attr("cx", function(d) { return x(d.timestamp) })
                    .attr("cy", function(d) { return y(d.count) })
                    .attr("r", 5);


                svg.selectAll(".text")
                    .data(data)
                    .enter()
                    .append("text") // Uses the enter().append() method
                    .attr("class", "label") // Assign a class for styling
                    // eslint-disable-next-line no-unused-vars
                    .attr("x", function(d, i) { return x(d.timestamp) })
                    .attr("y", function(d) { return y(d.count) })
                    .attr("dy", "-5")
                    .text(function(d) {return d.count; });

                this.onResize();

            },

            // --- Pie Chart ---
            setupGraphsPieChart(dataset){
                // chart dimensions
                let margin = {top: 40, right: 40, bottom: 40, left: 40};
                let width = 800 - margin.left - margin.right;
                let height = 600 - margin.top - margin.bottom;
                let default_ratio = width / height;
                // Determine current size and make the chart responsive
                function set_size() {
                    let h =0;
                    let w =0;
                    let current_width = window.innerWidth;
                    let current_height = window.innerHeight;
                    let current_ratio = current_width / current_height;
                    // desktop ratio
                    if (current_ratio > default_ratio) {
                        h = height;
                        w = width;
                    }
                    // mobile
                    else {
                        w = current_width;
                        h = w / default_ratio;
                    }
                    // Set new width and height taking margin into account
                    width = w - margin.left - margin.right;
                    height = h - margin.top - margin.bottom;
                }
                set_size();

                // a circle chart needs a radius
                let radius = Math.min(width, height) / 2.5;
                // legend dimensions
                // defines the size of the colored squares in legend
                let legendRectSize = 15;
                // defines spacing between squares
                let legendSpacing = 5;
                // define color scale
                let color = d3.scaleOrdinal([
                    `#0ee3ea`, `#5208f6`, `#33431e`, `#a36629`,
                    `#92462f`, `#b63e36`, `#b74a70`, `#946943`,
                    `#cb3707`, `#f66110`, `#de1459`, `#a15109`,
                    `#debb06`, `#f50303`, `#db04f3`, `#a15109`])
                // more color scales: https://bl.ocks.org/pstuffa/3393ff2711a53975040077b7453781a9

                // select element in the DOM with id 'pieChartVis'
                let svg = d3.select('#chartArea')
                    // append an svg element to the element we've selected
                    .append('svg')
                    // set an 'id' for svg element
                    .attr("id", "pieChartSVG")
                    .attr("style",
                        "padding-top: 2.5em; " +
                        "-webkit-box-shadow: 9px 10px 22px 1px rgba(0,0,0,0.58);" +
                        "-moz-box-shadow: 9px 10px 22px 1px rgba(0,0,0,0.58);" +
                        "box-shadow: 9px 10px 22px 1px rgba(0,0,0,0.58);" +
                        "outline: thin solid black;")
                    // set the width of the svg element we just added
                    .attr('width', width)
                    // set the height of the svg element we just added
                    .attr('height', height)
                    // append 'g' element to the svg element
                    .append('g')
                    // our reference is now to the 'g' element. centering the 'g' element to the svg element
                    .attr('transform', 'translate(' + (width / 2.5) + ',' + (height / 2.5) + ')');

                let arc = d3.arc()
                    // 0 for pie chart
                    .innerRadius(0)
                    // size of overall chart
                    .outerRadius(radius);


                // start and end angles of the segments
                let pie = d3.pie()
                    // how to extract the numerical data from each entry in our dataset
                    .value(function(d) { return d.count; })
                    // by default, data sorts in value. this will mess with our animation so we set it to null
                    .sort(null);

                dataset.forEach(function(d) {
                    // calculate count as we iterate through the data
                    //d.count = +d.count;
                    // add enabled property to track which entries are checked
                    d.enabled = true;
                });

                // creating the chart
                let path = svg
                    // select all path elements inside the svg. specifically the 'g' element
                    // they don't exist yet but they will be created below
                    .selectAll('path')
                    // associate dataset wit he path elements we're about to create
                    // must pass through the pie function
                    .data(pie(dataset))
                    //creates placeholder nodes for each of the values
                    .enter()
                    // replace placeholders with path elements
                    .append('path')
                    // define d attribute with arc function above
                    .attr('d', arc)
                    // style of slices
                    .style('stroke', 'white')
                    // use color scale to define fill of each label in dataset
                    .attr('fill', function(d) { return color(d.data.timestamp); })
                    // creates a smooth animation for each track
                    .each(function(d) { this._current - d; });


                // define legend
                let legend = svg
                    // selecting elements with class 'legend'
                    .selectAll('.legend')
                    // refers to an array of labels from our dataset
                    .data(color.domain())
                    // creates placeholder
                    .enter()
                    // replace placeholders with g elements
                    .append('g')
                    // each g is given a legend class
                    .attr('class', 'legend')
                    .attr('transform', function(d, i) {
                        // height of element is the height of the colored square plus the spacing
                        let height = legendRectSize + legendSpacing;
                        // vertical offset of the entire legend = height of a single element & half the total number of elements
                        let offset =  height * color.domain().length / 2;
                        // the legend is shifted to the left to make room for the text
                        let horizontal = 14 * legendRectSize;
                        // the top of the element is lifted up or down from the center using the offset defined earlier
                        // and the index of the current element 'i'
                        let vertical = i * height - offset;
                        //return translation
                        return 'translate(' + horizontal + ',' + vertical + ')';
                    });

                // adding colored squares to legend
                legend
                    // append rectangle squares to legend
                    .append('rect')
                    // width of rect size is defined above
                    .attr('width', legendRectSize)
                    // height of rect size is defined above
                    .attr('height', legendRectSize)
                    // each fill is passed a color
                    .style('fill', color)
                    // each stroke is passed a color
                    .style('stroke', 'black')
                    .on('click', function(label) {
                        // this refers to the colored squared just clicked
                        let rect = d3.select(this);
                        // set enabled true to default
                        let enabled = true;
                        // can't disable all options
                        let totalEnabled = d3.sum(dataset.map(function(d) {
                            if(d.count !==0){
                                // return 1 for each enabled entry. and summing it up
                                return (d.enabled) ? 1 : 0;
                            }

                        }));

                        // if class is disabled
                        if (rect.attr('class') === 'disabled') {
                            // remove class disabled
                            rect.attr('class', '');
                        } else {
                            // if less than two labels are flagged, exit
                            if (totalEnabled < 2) return;
                            // otherwise flag the square disabled
                            rect.attr('class', 'disabled');
                            // set enabled to false
                            enabled = false;
                        }

                        pie.value(function(d) {
                            // if entry label matches legend label
                            if (d.timestamp === label) d.enabled = enabled;
                            // update enabled property and return count or 0 based on the entry's status
                            return (d.enabled) ? d.count : 0;
                        });

                        // update pie with new data
                        path = path.data(pie(dataset));

                        // transition of redrawn pie
                        path.transition()
                            .duration(550) // 550 millisecond
                            // 'd' specifies the d attribute that we'll be animating
                            .attrTween('d', function(d) {
                                // this = current path element
                                let interpolate = d3.interpolate(this._current, d);
                                // interpolate between current value and the new value of 'd'
                                this._current = interpolate(0);
                                return function(t) {
                                    return arc(interpolate(t));
                                };
                            });
                    });

                // adding text to legend
                legend.append('text')
                    .attr('x', legendRectSize + legendSpacing)
                    .attr('y', legendRectSize - legendSpacing)
                    // return label
                    .text(function(d) { return d.toLocaleDateString(); });

                this.onResize();

            },

            //save chart to pdf
            print(chartSelected) {

                let today = new Date();
                let dd = String(today.getDate()).padStart(2, '0');
                let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                let yyyy = today.getFullYear();
                today = dd + '_' + mm + '_' + yyyy;

                const filename  = 'Visualization_' + today;
                let filenameUpdated = "";

                let chartType = "";

                const doc = new jsPDF('p', 'pt', 'a4', true);

                let svg = "";
                let svg_width = "";
                let svg_height = "";

                if(chartSelected === 'bar'){
                    svg = document.getElementById('chartArea');
                    chartType = "Bar";
                    filenameUpdated = filename + 'BarChart.pdf';

                }else if(chartSelected === 'line'){
                    svg =  document.getElementById('chartArea');
                    chartType = "Line";
                    filenameUpdated = filename + 'LineChart.pdf';
                }else{
                    svg = document.getElementById('chartArea');
                    chartType = "Pie";
                    filenameUpdated = filename + 'PieChart.pdf';
                }

                svg_width = svg.style.width / 2;
                svg_height = svg.style.height / 2;

                // 1. Keep a DOM reference to the SVG element
                // let pie = document.getElementById('pieChartSVG');
                //
                // let bar_ser = new XMLSerializer().serializeToString(bar_svg)
                //
                // // 2. Serialize element into plain SVG
                // let serializedSVG = new XMLSerializer().serializeToString(pie_svg);
                //
                // // 3. convert svg to base64
                // let base64Data = window.btoa(serializedSVG);

                //let bar = "data:image/svg+xml;base64," + bar_ser
                //console.log(bar);


                //add bar chart to the pdf
                html2canvas(svg).then(canvas => {
                    doc.text("Visualization", 10, 20);
                    doc.text("Generated by " + this.currentUser.name, 10, 40);
                    let barChart = canvas.toDataURL('image/png');
                    doc.addImage(barChart, 'JPEG', 10, 60, svg_width, svg_height);
                    doc.text(chartType + " Chart", 20, 400);
                    doc.save(filenameUpdated);

                });

            },



        }

    }



</script>
<style>
    #adminDashboardContainer {
        /* width: 100vw; */
        /* height: 100vh; */
        display: contents;
        /* overflow: hidden; */
        position: relative;
        flex: 1 1 auto;
        padding: 1rem;
    }

    #dashboardHeader {
        /*height: 6vh;*/
        background-color: white;
    }

    #dashboardOpenSearchSlideBar {
        /*height: 4vh;*/
        background-color: #ff9900;
        /*overflow: hidden;*/
    }

    #dashboardBody {
        /*min-height: 76vh;*/
        background-color: #00a0c6;
    }

    #visualizationArea {
        width: 100%;
        margin: auto;
    }

    #dateListArea{
        height: 200px;
        margin-top: 50px;
    }

    .smallChart{

    }

    .smallChart:hover{

    }
</style>