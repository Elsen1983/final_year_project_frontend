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
                currentUserVisualizationData:[]

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

                console.log(result)

                this.setupGraphsBarChart(result);

            },

            setupGraphsBarChart(list){

                console.log(list)

                // const w = 400;
                // const h = 500;
                //
                // // eslint-disable-next-line no-unused-vars
                // const svg = d3.select("#barChartVis").append("svg").attr("width", w).attr("height", h);


                let data = list;
                let margin = {top: 30, right: 50, bottom: 30, left: 50};

                let height = 350 - margin.top - margin.bottom;
                let width = 400 - margin.left - margin.right;

                // eslint-disable-next-line no-unused-vars
                let dynamicColor;

                // eslint-disable-next-line no-unused-vars
                let yScale = d3.scaleLinear().domain([0, d3.max(data)]).range([0, height]);
                // eslint-disable-next-line no-unused-vars
                let xScale = d3.scaleBand().domain(d3.range(0, data.length)).range([0, width]);
                //
                // eslint-disable-next-line no-unused-vars
                let colors = d3.scaleLinear().domain([0, data.length * .2, data.length * .4, data.length * .6, data.length * .8, data.length])
                    .range(['#7da6ff', '#6293fc', '#437efa', '#286dfc', '#0a5aff', '#0442c2']);

                // eslint-disable-next-line no-unused-vars
                let svg = d3.select('#barChartVis').append('svg')
                    .attr('id', 'barChart_svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .style('background', '#bce8f1')

                svg.append("text")
                    .attr("transform", "translate(100,0)")
                    .attr("x", -70)
                    .attr("y", 15)
                    .attr("font-size", "12px")
                    .attr("text-decoration", "underline")
                    .text('The selected action type is: ' + this.actionType)

                // eslint-disable-next-line no-unused-vars
                let group = svg.append('g')
                    .attr('class', 'bar_g')
                    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
                    .selectAll('rect')
                    .data(data)
                    .enter();

                // eslint-disable-next-line no-unused-vars
                let bar = group.append('rect').attr("class", "bar")
                    .styles({
                        'fill': function (d, i) {
                            return colors(i);
                        },
                        'stroke': '#1a1d6e',
                        'stroke-width': '2'
                    })
                    .attr('width', xScale.bandwidth())
                    .attr('x', function (d, i) {
                        return xScale(i);
                    })
                    .attr('height', 0)
                    .attr('y', height);

                //Add the SVG Text Element to the svgContainer
                // eslint-disable-next-line no-unused-vars
                let text = bar.select("text")
                    .data(data)
                    .enter()
                    .append("text");
                //
                // //Add SVG Text Element Attributes
                // // eslint-disable-next-line no-unused-vars
                // let textLabels = text
                //     .attr('x', function (d, i) {
                //         return xScale(i) + 10;
                //     })
                //     .attr('y', height - 15)
                //     .text(function (d, i) {
                //         return data[i];
                //     })
                //     .attr("font-family", "sans-serif")
                //     .attr("font-size", "13px")
                //     .attr("fill", "#bce8f1");
                //
                // bar.transition()
                //     .attr('height', function (d) {
                //         return yScale(d);
                //     })
                //     .attr('y', function (d) {
                //         return height - yScale(d);
                //     })
                //     .delay(function (d, i) {
                //         return i * 350;
                //     })
                //     .duration(3000)
                //     .ease(d3.easeElastic);
                //
                // bar.on("mouseover", onMouseOver)
                // bar.on("mouseout", onMouseOut)
                //
                // // eslint-disable-next-line no-unused-vars
                // function onMouseOver(d, i) {
                //     dynamicColor = this.style.fill;
                //     d3.select(this)
                //         .style('fill', '#3c763d');
                // }
                //
                // // eslint-disable-next-line no-unused-vars
                // function onMouseOut(d, i) {
                //     d3.select(this)
                //         .style('fill', dynamicColor);
                // }
                //
                //
                // let verticalGuideScale = d3.scaleLinear()
                //     .domain([0, d3.max(data)])
                //     .range([height, 0]);
                //
                // let vAxis = d3.axisLeft(verticalGuideScale)
                //     .ticks(15);
                //
                // let verticalGuide = d3.select('#barChart_svg').append('g').attr('class', 'vert_g');
                //
                // vAxis(verticalGuide);
                //
                // verticalGuide.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
                // verticalGuide.selectAll('path')
                //     .styles({
                //         fill: 'none',
                //         stroke: "#3c763d"
                //     });
                // verticalGuide.selectAll('line')
                //     .styles({
                //         stroke: "#3c763d"
                //     });
                //
                //
                // let hAxis = d3.axisBottom(xScale).tickFormat(x => `201${x.toFixed(data.size)}`);
                // let horizontalGuide = d3.select('#barChart_svg').append('g');
                // hAxis(horizontalGuide);
                // horizontalGuide.attr('transform', 'translate(' + margin.left + ', ' + (height + margin.top) + ')');
                //
                // horizontalGuide.selectAll('path')
                //     .styles({
                //         fill: 'none',
                //         stroke: "#3c763d"
                //     });
                //
                // horizontalGuide.selectAll('line')
                //     .styles({
                //         stroke: "#3c763d"
                //     });

//                document.getElementById('barChartData').innerHTML = "";
            },

            baseDashboardChanges(){
                this.themeSelector = '0';
            }


            //call setupAllDate
            // setupDateForAll(){
            //     this.setupAllDate();
            // },
            //check that 'All Date' button is switched on or not
            //allDateSelectorStatus(){
                //     if(this.allDateButtonStatus === false){
                //         this.clearTimeSelectorsArray();
                //     }
                //     else{
                //         this.getTimestampsFrom();
                //     }
                // },
                //clear the 'timeSelectFrom' and 'timeSelectTo' arrays because 'All Date' button was switch on
                // clearTimeSelectorsArray(){
                //     this.timeSelectFrom = undefined;
                //     this.timeSelectTo = undefined;
                //     document.getElementById('dateToSelector').setAttribute("disabled", "disabled");
                //     console.log("Setup all dates for ALL button after switch on ...");
                //     //setup data for 'All Date' button again
                //     this.setupDateForAll()
                //
                // },
                //setup the 'timeSelectFrom' and 'timeSelectTo' arrays because 'All Date' button was switch off
                // getTimestampsFrom() {
                //     console.log("Setup all dates for date From button");
                //     this.setupAllDate();
                // },
                //setup



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
</style>
