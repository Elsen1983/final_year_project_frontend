<template>
    <div class="container">
        <header class="jumbotron">
            <h1 class="display-3">
                <strong>{{currentUser.name}}</strong>,
                All User Data:
            </h1>

            <b-button v-b-modal.modal-xl squared variant="success" class="mb-2" size="lg" @click="baseDashboardChanges()">
                <b-img width="40px" fluid src="../assets/analysis.png" alt="Image 1"></b-img> Open Dashboard
            </b-button>

            <b-modal modal-class="modal-fullscreen" id="modal-xl" title="Client Dashboard" cancel-disabled ok-disabled hide-footer>
            <!--        Modal header        -->
                <template v-slot:modal-header="{ close }">
                    <template class="modal-title">
                        <h3><strong>Client Dashboard</strong> [{{currentUser.name}}]</h3>
                    </template>

                    <!-- Emulate built in modal header close button action -->
                    <b-button size="sm"  @click="close()" variant="danger">
                        Close Dashboard
                    </b-button>

                </template>
                <template v-slot:default id="dashboardContainer">
                    <b-row >
                        <b-col cols="3">Select theme for Dashboard</b-col>
                        <b-col cols="3">
                                    <b-form-select v-model="themeSelector" @change="onchangeTheme()" class="form-control form-control-sm">
                                        <!-- This slot appears above the options from 'options' prop -->
                                        <option :value="undefined" disabled style="display:none">-- Please select a theme --</option>
                                        <!-- These options will appear after the ones from 'options' prop -->
                                        <option :key="index" :value="t" v-for="(t, index) in variants">{{t}}</option>
                                    </b-form-select>
                        </b-col>
                    </b-row>
                    
                    <hr class="mb-2 mt-2 pt-0 hr-separators">

                    <!--         SIDEBAR FOR SEARCHING PARAMETERS           -->
                    <b-button v-b-toggle.sidebar-no-header variant="warning" @click="refreshSearch()">Searching parameters </b-button>
                    <b-sidebar  id="sidebar-no-header" aria-labelledby="sidebar-no-header-title" title="Search Parameters"
                                sidebar-class="border-right border-danger" bg-variant="dark" text-variant="light"
                                width="30vw" height="100vh"
                                >
                        <template v-slot:default="{ hide }">
                            <form name="form" @submit.prevent="submitSearch" class="mt-2em">
                                <hr class="hr-separators">
                                <div class="p-3">
                                    <b-row class="mt-4">
                                        <b-col cols="12">Please select the options below for visualize your data.</b-col>
                                    </b-row>

                                    <b-row class="mt-4">
                                        <b-col cols="6">Date FROM</b-col>
                                        <b-col cols="6">Date TO</b-col>
                                    </b-row>
                                    <b-row>
                                        <b-col cols="6">
                                            <b-form-select @change="onchangeDateFrom()" class="form-control form-control-sm" v-model="dateFrom">
                                                <option :value="undefined" disabled style="display:none">Select date FROM</option>
                                                <option :key="index" :value="t" v-for="(t, index) in timeSelectFrom">{{t}}</option>
                                            </b-form-select>
                                        </b-col>
                                        <b-col cols="6">
                                            <b-form-select id="dateToSelector" disabled @change="onchangeDateTo()" class="form-control form-control-sm" v-model="dateTo">
                                                <option :value="undefined" disabled style="display:none">Select date TO</option>
                                                <option :key="index" :value="t" v-for="(t, index) in timeSelectTo">{{t}}</option>
                                            </b-form-select>
                                        </b-col>
                                    </b-row>
<!--                                    <div class="mb-3" v-if="timeSelected !== undefined && timeSelected.length !== 0 "><strong>Selected date(s):</strong> {{ timeSelected.join(" - ") }}</div>-->
                                    <b-row class="mt-4">
                                        <b-col cols="6">Type of action</b-col>
                                    </b-row>
                                    <b-row>
                                        <b-col cols="6">
                                            <template>
                                                <div>
                                                    <b-form-select id="actionSelector" @change="onchangeAction()" v-model="actionType" :options="actionTypeList" class="form-control form-control-sm">
                                                        <option :value="undefined" disabled style="display:none">Select type of action</option>
                                                    </b-form-select>
<!--                                                    <div class="mt-3">Selected: <strong>{{ actionType }}</strong></div>-->
                                                </div>
                                            </template>
                                        </b-col>
                                    </b-row>

                                    <b-row class="mt-4 mb-2">
                                        <b-col cols="12">After selected the visualization parameters, please press the "Submit" button.</b-col>
                                    </b-row>
                                    <hr class="hr-separators">
                                    <button id="submitSearchBTN" class="btn btn-success btn-block mt-2" @click="hide" disabled><span class="spinner-border spinner-border-sm" v-show="submit"></span>
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

                    <!--          Visualization area(s)          -->
                    <template>
                        <div id="visArea">
                            <b-card no-body class="mt-1">
                                <b-tabs card>
                                    <b-tabs
                                            active-nav-item-class="font-weight-bold text-uppercase text-danger"
                                            active-tab-class="font-weight-bold text-success"
                                            content-class="mt-3"
                                    >
                                        <b-tab active>
                                            <template v-slot:title class="chartTab">
                                                <b-img width="40px" fluid src="../assets/barchart_icon.png" alt="Image 1"></b-img>
                                                 Bar Chart
                                            </template>

                                            <b-card class="visMainArea overflow-hidden justify-content-md-center text-center" align-v="center" >
                                                <b-row no-gutters>
                                                    <b-col md="1">
                                                    </b-col>
                                                    <b-col md="8">
                                                        <section id="barChartVis">
                                                            <b-img width="800px" fluid src="../assets/datavisualization.png" alt="Image 1"></b-img>
                                                        </section>
                                                    </b-col>
                                                    <b-col md="2">
                                                        <b-card no-body class="cardWithDates mb-1" header="Selected dates">
                                                                <b-card-text text="black" class="detailsText">For more details click on it.</b-card-text>
                                                                <b-card-header header-tag="header" class="p-1" role="tab" v-for="(item, idx) in reducedObjectArrayForList" :key="idx">
                                                                    <b-button block v-b-toggle="'accordion-' + idx" variant="info">{{item.timestamp.toLocaleDateString() }}</b-button>
                                                                    <b-collapse :id="'accordion-' + idx"  :accordion="'my-accordion'" role="tabpanel">
                                                                        <b-card-body class="detailsCardBody">
                                                                            <b-card-text>Action executed by <strong>{{currentUser.name}}</strong> (<i>{{currentUser.username}}</i>).</b-card-text>
                                                                            <b-card-text>Selected date: <strong>{{item.timestamp.toLocaleDateString()}}</strong>.</b-card-text>
                                                                            <b-card-text >{{actionType.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); })}} happened <strong>{{item.count}}</strong> time(s) on this date.</b-card-text>
                                                                        </b-card-body>
                                                                    </b-collapse>
                                                                </b-card-header>
                                                        </b-card>
                                                    </b-col>
                                                    <b-col md="1">

                                                    </b-col>
                                                </b-row>
                                            </b-card>
                                        </b-tab>
                                        <b-tab >
                                            <template v-slot:title class="chartTab">
                                                <b-img width="40px" fluid src="../assets/linechart_icon.png" alt="Image 1"></b-img>
                                                Line Chart
                                            </template>
                                            <b-card class="visMainArea overflow-hidden justify-content-md-center text-center" align-v="center">
                                                <b-row no-gutters>
                                                    <b-col md="1">
                                                    </b-col>
                                                    <b-col md="8">
                                                        <section id="lineChartVis">
                                                            <b-img width="800px" fluid src="../assets/datavisualization.png" alt="Image 1"></b-img>
                                                        </section>
                                                    </b-col>
                                                    <b-col md="2">
                                                        <b-card no-body class="cardWithDates mb-1" header="Selected dates">
                                                            <b-card-text class="detailsText">For more details click on it.</b-card-text>
                                                            <b-card-header header-tag="header" class="p-1" role="tab" v-for="(item, idx) in reducedObjectArrayForList" :key="idx">
                                                                <b-button block v-b-toggle="'accordion-' + idx" variant="info">{{item.timestamp.toLocaleDateString() }}</b-button>
                                                                <b-collapse :id="'accordion-' + idx"  :accordion="'my-accordion'" role="tabpanel">
                                                                    <b-card-body class="detailsCardBody">
                                                                        <b-card-text>Action executed by <strong>{{currentUser.name}}</strong> (<i>{{currentUser.username}}</i>).</b-card-text>
                                                                        <b-card-text>Selected date: <strong>{{item.timestamp.toLocaleDateString()}}</strong>.</b-card-text>
                                                                        <b-card-text >{{actionType.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); })}} happened <strong>{{item.count}}</strong> time(s) on this date.</b-card-text>
                                                                    </b-card-body>
                                                                </b-collapse>
                                                            </b-card-header>
                                                        </b-card>
                                                    </b-col>
                                                    <b-col md="1">
                                                    </b-col>
                                                </b-row>
                                            </b-card>
                                        </b-tab>
                                        <b-tab>
                                            <template v-slot:title class="chartTab">
                                                <b-img width="40px" fluid src="../assets/piechart_icon.png" alt="Image 1"></b-img>
                                                Pie Chart
                                            </template>
                                            <b-card class="visMainArea overflow-hidden justify-content-md-center text-center" align-v="center">
                                                <b-row no-gutters>
                                                    <b-col md="1">
                                                    </b-col>
                                                    <b-col md="8">
                                                        <section id="pieChartVis">
                                                            <b-img width="800px" fluid src="../assets/datavisualization.png" alt="Image 1"></b-img>
                                                        </section>
                                                    </b-col>
                                                    <b-col md="2">
                                                        <b-card no-body class="cardWithDates mb-1" header="Selected dates">
                                                            <b-card-text class="detailsText">For more details click on it.</b-card-text>
                                                            <b-card-header header-tag="header" class="p-1" role="tab" v-for="(item, idx) in reducedObjectArrayForList" :key="idx">
                                                                <b-button block v-b-toggle="'accordion-' + idx" variant="info">{{item.timestamp.toLocaleDateString() }}</b-button>
                                                                <b-collapse :id="'accordion-' + idx"  :accordion="'my-accordion'" role="tabpanel">
                                                                    <b-card-body class="detailsCardBody">
                                                                        <b-card-text>Action executed by <strong>{{currentUser.name}}</strong> (<i>{{currentUser.username}}</i>).</b-card-text>
                                                                        <b-card-text>Selected date: <strong>{{item.timestamp.toLocaleDateString()}}</strong>.</b-card-text>
                                                                        <b-card-text >{{actionType.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); })}} happened <strong>{{item.count}}</strong> time(s) on this date.</b-card-text>
                                                                    </b-card-body>
                                                                </b-collapse>
                                                            </b-card-header>
                                                        </b-card>
                                                    </b-col>
                                                    <b-col md="1">
                                                    </b-col>
                                                </b-row>
                                            </b-card>
                                        </b-tab>
                                    </b-tabs>
                                </b-tabs>
                            </b-card>
                        </div>
                    </template>

                </template>
            </b-modal>

        </header>
        <a @click="logOut" class="btn btn-link log-out">LogOut</a>
    </div>
</template>
<script>
    import UserService from '../services/user.service';
    import User from "../models/user";
    // eslint-disable-next-line no-unused-vars
    import * as d3 from 'd3';
    export default {
        name: 'userdata',
        data() {
            return {
                currentUser: new User('','','','',''),
                currentUserBasicData: [],
                //theme
                show: false,
                variants: ['Light','Dark','Colorful'],
                themeSelector: undefined,
                styleRoute: "../assets/style/lightTheme.css",
                //
                getData: '',
                //date selection
                dateFrom: undefined,
                dateTo: undefined,
                timeSelectFrom: [],
                timeSelectTo: [],
                timeSelected: [],
                //type selection
                actionType: undefined,
                actionTypeList: [],
                selectedObjectsBeforeActionTypeSelection: [],
                //selected objects from 'currentUserBasicData'
                selectedObjectsAfterSearch: [],
                //submit
                submit: '',
                currentUserVisualizationData:[],
                keyAndValueSelectedDatesObjectsArray:[],
                reducedObjectArrayForList: []

            };
        },
        computed: {
        },
        created() {
            this.currentUser = UserService.currentUserValue;
            if (!this.currentUser) {
                this.$router.push('/login');
            }
            this.currentUserBasicData = UserService.currentUserBasicDataValue;
            //console.log(this.currentUserBasicData);



            //logOut the user when refreshing a page
            if(this.currentUserBasicData !== null) {
                console.log("Setup all dates for selection");
                this.setupAllDate();
            }else{
                this.logOut();
            }
        },
        mounted() {
        },
        methods: {
            logOut() {
                UserService.logOut().then(() => {
                    this.$router.push('/login');
                });
            },

            refreshSearch(){
                if(this.timeSelected !== undefined && this.timeSelected.length !== 0){
                    document.getElementById('actionSelector').removeAttribute("disabled");
                }else{
                    document.getElementById('actionSelector').setAttribute("disabled", "disabled");
                }
                if(this.timeSelectTo !== undefined && this.timeSelectTo.length !== 0){
                    document.getElementById('dateToSelector').removeAttribute("disabled");
                }
                else{
                    document.getElementById('dateToSelector').setAttribute("disabled", "disabled");
                }

                if(this.actionType === undefined){
                    document.getElementById('actionSelector').setAttribute("disabled", "disabled");
                }
            },

            //methods for the changing of the page elements
            onchangeTheme(){
                console.log(this.themeSelector + " Theme selected");
                switch (this.themeSelector) {
                    case "Light":
                        themeChanger("#acc5e0");
                        break;
                    case "Dark":
                        themeChanger("#101f2f");
                        break;
                    case "Colorful":
                        themeChanger("#88d758");
                        break;
                    default:
                    // code block
                }
                function themeChanger(background) {
                    document.getElementById('modal-xl___BV_modal_content_').style.backgroundColor = background;
                }
            },

            //setup the dates for 'All Date' and for selectors of From and To
            setupAllDate(){
                let timesFrom = [];
                let date = "";
                timesFrom.push("All Date");
                    this.currentUserBasicData.forEach(obj => {
                        Object.entries(obj).forEach(([key, value]) => {
                            if (key === 'timestamp') {
                                date = value.split(" ");
                                // eslint-disable-next-line no-empty
                                if (timesFrom.indexOf(date[0]) !== -1) {
                                } else {
                                    timesFrom.push(date[0]);
                                }
                            }
                        });
                    });

                    this.timeSelectFrom = [...timesFrom];
                    console.log("timeSelectFrom -> " + this.timeSelectFrom)

            },

            onchangeDateFrom(){
                this.dateTo = undefined;
                this.timeSelectTo = undefined;
                this.timeSelected = undefined;
                this.actionTypeList = undefined;

                if(this.dateFrom !== "All Date" && this.dateFrom !== this.timeSelectFrom[this.timeSelectFrom.length -1]){
                    document.getElementById('dateToSelector').removeAttribute("disabled");
                    document.getElementById('actionSelector').setAttribute("disabled", "disabled");
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
                else{

                    document.getElementById('dateToSelector').setAttribute("disabled", "disabled");
                    document.getElementById('submitSearchBTN').setAttribute("disabled", "disabled");

                    //if last date selected
                    if(this.dateFrom === this.timeSelectFrom[this.timeSelectFrom.length -1]){
                        let newArray = [];
                        newArray.push(this.timeSelectFrom[this.timeSelectFrom.length -1]);
                        this.timeSelected = [...newArray];
                        this.setupValidActionForAll(this.timeSelected);
                    }
                    //if 'All Date' selected
                    else{
                        this.timeSelected = [...this.timeSelectFrom.slice(1)];
                        this.setupValidActionForAll(this.timeSelected);
                    }

                    document.getElementById('actionSelector').removeAttribute("disabled");
                }
            },

            onchangeDateTo(){
                //console.log("Time selected between " + this.dateFrom + " and " + this.dateTo);
                //logic: get the elements from timeSelectFrom where the elements are equal 'dateFrom' and all after that
                //until element which equal with 'dateTo'
                let dateFromArray = [];
                let indexFrom = this.timeSelectFrom.findIndex(index => index === this.dateFrom);
                console.log(indexFrom);
                let indexTo= this.timeSelectFrom.findIndex(index => index === this.dateTo);
                console.log(indexTo);

                dateFromArray = [...this.timeSelectFrom.slice(indexFrom,indexTo+1)]
                this.timeSelected = [...dateFromArray]

                //call action function here
                this.setupValidActionForAll(this.timeSelected);

                document.getElementById('actionSelector').removeAttribute("disabled");

            },

            setupValidActionForAll(arrayProc){
                //this.actionTypeList = undefined;
                //logic:
                //          loop trough the main object array
                //          get objects where the 'timestamp(s)' are found in the 'selectedTimes' array too
                //          loop trough the new object array and find the unique 'type' keys -> store in an array
                //          populate 'action' dropdown' from the new array

                let selectedTimes = arrayProc;
                console.log("Selected interval for date(s) : " + selectedTimes);

                let allActionObjectArray = [];


                let date = "";
                this.currentUserBasicData.forEach(obj => {
                    Object.entries(obj).forEach(([key, value]) => {
                        if (key === 'timestamp') {
                            date = value.split(" ");

                            if (selectedTimes.indexOf(date[0]) !== -1) {
                                allActionObjectArray.push(obj);
                            }
                        }
                    });
                });
                this.selectedObjectsBeforeActionTypeSelection = [...allActionObjectArray];
                console.log("Objects with valid timestamp(s) -> " + JSON.stringify(allActionObjectArray));

                let validTypesList = [];
                allActionObjectArray.forEach(obj => {
                    Object.entries(obj).forEach(([key, value]) => {
                        if (key === 'type') {
                            // eslint-disable-next-line no-empty
                            if (validTypesList.indexOf(value) !== -1) {
                            } else {
                                validTypesList.push(value);
                            }
                        }
                    });
                });
                console.log(validTypesList);

                this.actionTypeList = [...validTypesList.sort()];


                //this.actionTypeList = [... allAction];
            },

            onchangeAction(){
              this.makeSubmitAvailable(this.actionType)
            },

            makeSubmitAvailable(action){
                console.log(action)
                document.getElementById('submitSearchBTN').removeAttribute('disabled');
            },

            async submitSearch(){
                this.currentUserVisualizationData.length=0;

                // console.log("Current User: " + this.currentUser.username)
                // console.log("Selected action: " + this.actionType)

                await UserService.userVisualizationData(this.currentUser, this.actionType);


                //compare the object arrays and find the same elements in both based on timestamp key
                let result = UserService.currentUserVisualizationDataValue.filter(o1 => this.selectedObjectsBeforeActionTypeSelection.some(o2 => o1.timestamp === o2.timestamp));
                //To get unique elements instead of the common ones, change the last line to let result = arr1.filter(o1 => !arr2.some(o2 => o1.id === o2.id)); to return the opposite value


                this.calculateVisualizationData(result);

            },

            calculateVisualizationData(resultObjectsArray){

                this.keyAndValueSelectedDatesObjectsArray.length = 0;
                //console.log(resultObjectsArray)

                //get all dates without 'All Dates'
                let allDates = [...this.timeSelected];
                //console.log("selected dates: " + allDates);


                //create an objects array with all the dates(timestamp) and count(value) them with 0
                for (let i=0; i< allDates.length; i++){
                    let obj = {};
                    let timestamp = allDates[i];
                    let count = 0;
                    obj.timestamp = timestamp;
                    obj.count = count;
                    this.keyAndValueSelectedDatesObjectsArray.push(obj);
                }
                // eslint-disable-next-line no-unused-vars
                // let keyAndValueSelectedDatesObjectsArray = allDates.map((str, index) => ({ timestamp: str, value: 0 }));
                //console.log(this.keyAndValueSelectedDatesObjectsArray);

                for(let i = 0; i<this.keyAndValueSelectedDatesObjectsArray.length; i++){

                    delete this.keyAndValueSelectedDatesObjectsArray[i]['date'];
                    delete this.keyAndValueSelectedDatesObjectsArray[i]['value'];
                    //console.log(this.keyAndValueSelectedDatesObjectsArray[i].timestamp);

                    for(let j = 0; j<resultObjectsArray.length; j++) {
                        let date = "";
                        date = resultObjectsArray[j].timestamp.split(" ");

                        //console.log(date[0])

                        if(this.keyAndValueSelectedDatesObjectsArray[i].timestamp === date[0]){
                            //console.log("same")
                            this.keyAndValueSelectedDatesObjectsArray[i].count++;
                        }
                    }
                }

                //time to close sidebar

                console.log(this.keyAndValueSelectedDatesObjectsArray)

                let data = [...this.keyAndValueSelectedDatesObjectsArray];

                //reduce the dataset with key 'count' where value is 0
                this.reducedObjectArrayForList = [...data].filter(function(e) { return e.count !== 0; });

                this.clearSVGCharts()

                this.setupGraphsBarChart(this.reducedObjectArrayForList)

                this.setupGraphsLineChart(this.reducedObjectArrayForList)

                this.setupGraphsPieChart(this.reducedObjectArrayForList)
            },

            clearSVGCharts(){
                let barChart = document.getElementById("barChartVis");
                let lineChart = document.getElementById("lineChartVis");
                let pieChart = document.getElementById("pieChartVis");

                if(barChart.hasChildNodes() ===true){
                    barChart.removeChild(barChart.childNodes[0]);
                }
                if(lineChart.hasChildNodes() ===true){
                    lineChart.removeChild(lineChart.childNodes[0]);
                }
                if(pieChart.hasChildNodes() ===true){
                    pieChart.removeChild(pieChart.childNodes[0]);
                }
            },

            // --- Bar Chart ---
            setupGraphsBarChart(data){

                console.log(data);

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
                let svg = d3.select("#barChartVis").append("svg")
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

    },

            // --- Line Chart ---
            setupGraphsLineChart(data){

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


                let svg = d3.select('#lineChartVis').append("svg")
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

                svg.append('text')
                    .attr('x', 10)
                    .attr('y', -15)
                    .text(this.actionType);


            },

            // --- Pie Chart ---
            setupGraphsPieChart(dataset){

                // chart dimensions
                let margin = {top: 40, right: 40, bottom: 40, left: 40};
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
                let svg = d3.select('#pieChartVis')
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
                    // select all path elements inside the svg. specifically the 'g' element.
                    // they don't exist yet but they will be created below
                    .selectAll('path')
                    // associate dataset wit he path elements we're about to create.
                    // must pass through the pie function. it magically knows how to extract values and bakes it into the pie
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

            },

            baseDashboardChanges(){
                this.dateFrom= undefined;
                this.dateTo= undefined;
                this.actionType = undefined;

                this.themeSelector = undefined;

                this.keyAndValueSelectedDatesObjectsArray = [];
                this.reducedObjectArrayForList = [];
            }

        }
    }
    window.onbeforeunload = function(){
        this.$router.push('/login')
        return "Are you sure you want to close the window?";
    }
</script>
<style>
    #modal-xl{
        padding-top: 0;
        padding-bottom: 0;
    }
    .modal-fullscreen .modal-dialog {
        max-width: 100%;
        min-width: 1074px;
        margin: 0;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        height: 100vh;
        display: flex;
        position: fixed;
        z-index: 100000;
        color: black;
    }
    hr{
        margin-top: 0.4rem;
        margin-bottom: 0.2rem;
    }
    .hr-separators{
        color: #ff9900;
        border: #ff9900 1px solid;
    }

    .b-sidebar {
        padding-top: 2em;
        min-width: 200px !important;
        /*height: 75vh !important;*/
    }

    #sidebarCloseBTN{
        position: absolute;
        top: 2em;
        right: 1em;
        width: 20%;
    }

    /*
    Bar Chart Style
    */
    .bar {
        fill: #319bbe;
    }

    /*
    line chart style
    */
    .line {
        fill: none;
        stroke: #0246cd;
        stroke-width: 3;
    }
    .axis path,
    .axis line {
        fill: none;
        stroke: #000;
        shape-rendering: crispEdges;
    }
    .axis text {
        font-size: 10px;
    }

    /*
    Pie Chart style
    */
    .title-holder {
        text-align: center;
    }
    .title {
        font-family: 'Lato', sans-serif;
    }
    .subtitle {
        font-size: 20px;
    }
    .font {
        font-size: 18px;
    }

    /* legend */
    .legend {
        font-size: 14px;
    }
    rect {
        cursor: pointer;
        stroke-width: 3;
    }
    rect.disabled {
        fill: transparent !important;
    }

    .cardWithDates{
        max-height: 460px;
        max-width: 300px;
        margin: 15px 0 0;
        /*margin-bottom: 10px;*/
        overflow-y:scroll;
        -webkit-overflow-scrolling: touch;

        -webkit-box-shadow: 9px 10px 22px 1px rgba(0,0,0,0.58);
        -moz-box-shadow: 9px 10px 22px 1px rgba(0,0,0,0.58);
        box-shadow: 9px 10px 22px 1px rgba(0,0,0,0.58);
        outline: thin solid black;

    }

    .visMainArea{
        background-color: white;
        max-width: 1920px;
        min-width: 1280px;
        min-height: 60vh;
        border: 2px solid #908d8d;
        margin-top: 1em;
    }

    #visArea{
        min-width: 1280px;
        overflow: hidden;
    }
    #visArea a{
       color: black;
    }

    #visArea .card-body {
        flex: 0;
        min-height: 1px;
        padding: 1.25rem;
    }

    /* chart */
    #pieChartVis {
        position: relative;
        display: block;
    }

    .card{
        padding:0;
    }
    #modal-xl___BV_modal_content_{
        overflow-y: scroll;
    }

    .detailsText{
        padding-left: 1em;
    }

    .detailsCardBody{
        flex: 1 1 auto;
        font-size: 13px;
        color: black;
    }

    section {
        /*padding: 1em;*/
        /*border: 3px black solid;*/
        float: left;
    }

    #lineChartSVG, #barChartSVG,#pieChartSVG{
        margin: 1em;
    }

</style>
