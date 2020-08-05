<template>
    <div class="container">
        <header class="jumbotron">
            <h1 class="display-3">
                <strong>{{currentUser.name}}</strong>,
                All User Data:
            </h1>
            <b-button v-b-modal.modal-xl variant="primary" @click="baseDashboardChanges()">Open Dashboard</b-button>

            <b-modal modal-class="modal-fullscreen" id="modal-xl" title="Client Dashboard">
                <template v-slot:modal-header="{ close }">
                    <h4><strong>Client Dashboard</strong> [{{currentUser.name}}]</h4>
                    <!-- Emulate built in modal header close button action -->
                    <b-button size="sm"  @click="close()">
                        Close Dashboard
                    </b-button>

                </template>
                <template v-slot:default id="dashboardContainer">


                    <b-row class="mb-1">
                        <b-col cols="3">Select theme for Dashboard</b-col>
                        <b-col cols="3">
                            <label>
                                <select v-model="themeSelector" @change="onchangeTheme()" class="form-control form-control-sm">
                                    <option :key="index" :value="t" v-for="(t, index) in variants">{{t}}</option>
                                </select>
                            </label>
                        </b-col>
                    </b-row>
                    
                    <hr class="m-0 pt-0">


                    <!--         SIDEBAR FOR SEARCHING PARAMETERS           -->
                    <b-button v-b-toggle.sidebar-no-header @click="refreshSearch()">Searching parameters </b-button>
                    <b-sidebar id="sidebar-no-header" aria-labelledby="sidebar-no-header-title" width="35vw" height="50vh" sidebar-class="border-right border-danger" no-header shadow>
                        <template v-slot:default="{ hide }">
                            <form name="form" @submit.prevent="submitSearch">
                                <div class="p-3">
                                    <b-row>
                                        <b-col cols="12">Please select the options below for visualize your data.</b-col>
                                    </b-row>
                                    <b-row >
                                        <b-col cols="4">
                                            <label>
                                                <select @change="onchangeDateFrom()" class="form-control form-control-sm" v-model="dateFrom">
                                                    <option :value="undefined" disabled style="display:none">Select date FROM</option>
                                                    <option :key="index" :value="t" v-for="(t, index) in timeSelectFrom">{{t}}</option>
                                                </select>
                                            </label>
                                        </b-col>
                                        <b-col cols="4">
                                            <label>
                                                <select id="dateToSelector" disabled @change="onchangeDateTo()" class="form-control form-control-sm" v-model="dateTo">
                                                    <option :value="undefined" disabled style="display:none">Select date TO</option>
                                                    <option :key="index" :value="t" v-for="(t, index) in timeSelectTo">{{t}}</option>
                                                </select>
                                            </label>
                                        </b-col>
                                    </b-row>
                                    <div class="mb-3" v-if="timeSelected !== undefined && timeSelected.length !== 0 "><strong>Selected date(s):</strong> {{ timeSelected.join(" - ") }}</div>
                                    <b-row>
                                        <b-col cols="4">
                                            <template>
                                                <div>

                                                    <b-form-select id="actionSelector" @change="onchangeAction()" v-model="actionType" :options="actionTypeList" class="form-control form-control-sm">
                                                        <option :value="undefined" disabled style="display:none">Select type of action</option>
                                                    </b-form-select>
                                                    <div class="mt-3">Selected: <strong>{{ actionType }}</strong></div>
                                                </div>
                                            </template>
                                        </b-col>
                                    </b-row>

                                        <button id="submitSearchBTN" class="btn btn-primary btn-block" disabled><span class="spinner-border spinner-border-sm" v-show="submit"></span>
                                            <span>Submit Search</span>
                                        </button>

                                    <b-button variant="primary" block @click="hide">Close Sidebar</b-button>
                                </div>
                            </form>
                        </template>
                    </b-sidebar>
                    <template>
                        <div>
                            <b-tabs
                                    active-nav-item-class="font-weight-bold text-uppercase text-danger"
                                    active-tab-class="font-weight-bold text-success"
                                    content-class="mt-3"
                            >
                                <b-tab title="Bar Chart" active>
                                    <p ></p>
                                    <section id="barChartVis">
<!--                                        <svg width="500" height="500"></svg>-->
                                    </section>
                                    <p>I'm the first tab</p>
                                </b-tab>
                                <b-tab title="Line Chart">
                                    <section id="lineChartVis">
                                        <!--                                        <svg width="500" height="500"></svg>-->
                                    </section>
                                    <p>I'm the second tab</p>
                                </b-tab>
                                <b-tab title="Pie Chart" >
                                    <p>I'm the third tab!</p>
                                </b-tab>
                            </b-tabs>
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
                themeSelector:'0',
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
                keyAndValueSelectedDatesObjectsArray:[]

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

                    //call action function here ?
                    //clear action selector array and selection too ...

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
                console.log(resultObjectsArray)

                //get all dates without 'All Dates'
                let allDates = [...this.timeSelected];
                console.log("selected dates: " + allDates);


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
                console.log(this.keyAndValueSelectedDatesObjectsArray);

                for(let i = 0; i<this.keyAndValueSelectedDatesObjectsArray.length; i++){

                    delete this.keyAndValueSelectedDatesObjectsArray[i]['date'];
                    delete this.keyAndValueSelectedDatesObjectsArray[i]['value'];
                    console.log(this.keyAndValueSelectedDatesObjectsArray[i].timestamp);

                    for(let j = 0; j<resultObjectsArray.length; j++) {
                        let date = "";
                        date = resultObjectsArray[j].timestamp.split(" ");

                        console.log(date[0])

                        if(this.keyAndValueSelectedDatesObjectsArray[i].timestamp === date[0]){
                            //console.log("same")
                            this.keyAndValueSelectedDatesObjectsArray[i].count++;
                        }
                    }
                }


                console.log(this.keyAndValueSelectedDatesObjectsArray)

                let data = [...this.keyAndValueSelectedDatesObjectsArray];

                this.setupGraphsBarChart(data)

                this.setupGraphsLineChart(data)
            },

            //need to be fixed, but works mostly
            // eslint-disable-next-line no-unused-vars
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

                // data.sort(function(a,b){
                //     return new Date(b.date) - new Date(a.date);
                // });

                let height  = 500;
                let width   = window.innerWidth / 2;
                // eslint-disable-next-line no-unused-vars
                let hEach   = 40;

                let margin = {top: 25, right: 50, bottom: 75, left: 25};

                width =     width - margin.left - margin.right;
                height =    height - margin.top - margin.bottom;

                let svg = d3.select('#lineChartVis').append("svg")
                    .attr("id", "lineChart")
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
                    .curve(d3.curveMonotoneX);

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
                    .attr("transform", "rotate(45)")
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
                    .attr('y', -5)
                    .text(this.actionType);
                

            },

            setupGraphsBarChart(data){

                console.log(data);

                let maxcount = 0;
                for(let i=0; i<data.length; i++){
                    if(data[i].count > maxcount){
                        maxcount = data[i].count;
                    }
                }

                // set the dimensions and margins of the graph
                let margin = {top: 20, right: 20, bottom: 30, left: 40},
                    width = 700 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;

                // set the ranges
                let x = d3.scaleBand()
                    .range([0, width])
                    .padding(0.1);

                let y = d3.scaleLinear()
                    .range([height, 0]);

                // append the svg object to the body of the page
                // append a 'group' element to 'svg'
                // moves the 'group' element to the top left margin
                let svg = d3.select("#barChartVis").append("svg")
                    .attr("id", "barChart")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");


                // Scale the range of the data in the domains
                x.domain(data.map(function(d) { return d.timestamp; }));
                y.domain([0, d3.max(data, function(d) { return d.count; })]);
                // append the rectangles for the bar chart
                svg.selectAll(".bar")
                    .data(data)
                    .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d) { return x(d.timestamp); })
                    .attr("width", x.bandwidth())
                    .attr("y", function(d) { return y(d.count); })
                    .attr("height", function(d) { return height - y(d.count); });
                // add the x Axis
                svg.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x));
                // add the y Axis
                svg.append("g")
                    .call(d3.axisLeft(y));



    },

            baseDashboardChanges(){
                this.themeSelector = '0';
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
        margin: 0;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        height: 100vh;
        display: flex;
        position: fixed;
        z-index: 100000;
    }
    hr{
        margin-top: 0.4rem;
        margin-bottom: 0.2rem;
    }

    .b-sidebar {
        height: 75vh !important;
    }

    /*
    line chart style
    */
    .line {
        fill: none;
        stroke: #ffab00;
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

</style>
