var app = angular.module("questionBuilder",[]);


app.controller("myCtrl", function ($scope,$window,$rootScope) {
    $scope.ritems = [];
    $scope.blueImages = ['images/circle-blue.png',
        'images/heart-blue.png','images/lego-blue.png',
        'images/rect-blue.png', 'images/square-blue.png',
        'images/triangle-blue.png',
    ];
    $scope.redImages = ['images/circle-red.png',
        'images/heart-red.png', 'images/square-red.png',
        'images/lego-red.png','images/rect-red.png', 'images/triangle-red.png'];

    $scope.greenImages = ['images/circle-green.png','images/heart-green.png',
        'images/triangle-green.png',
        'images/lego-green.png', 'images/rect-green.png','images/leaf.png', 'images/square-green.png', ];
    $scope.yellowImages = ['images/circle-yellow.png',
        'images/heart-yellow.png',
         'images/lego-yellow.png',
        'images/rect-yellow.png',
        'images/smiley.png',
        'images/square-yellow.png', 'images/star.png',
        'images/triangle-yellow.png']
    $scope.citems = [];
    $scope.images = [];
    $scope.choices = [{choice: '', answer: '', index: 1}];
    $scope.rChoices = ['Default'];
    $scope.missedMultiSelectField = false;
    $scope.qsType = ['Select', 'Addition', 'Multiplication', 'Subtraction', 'Division'];
    $scope.choiceType = ['Select', 'Drag And Drop', 'Fill', 'Multi Select'];
    $scope.multiplicationType = ['Select', 'Vertical', 'Horizontal'];
    $scope.symbols = [{value: '&copy'}, {value: '+'}, {value: '='}];
    $scope.selectedColForSymbol = {};
    $scope.solutionVisibility = false;
    $scope.title = '';
    $scope.submitBtnDisabled = true;
    $scope.questionMetaData = {
        choiceTypeSelected: "Select",
        qsTypeSelected: "Select",
        multiplicationType: "Select",
        title: "",
        solutionType: ""
    };
    $scope.solutionType = ['Select', 'Model', 'Side By Side'];
    $scope.solutionContent = [];
    $scope.solutionCols = [];
    $scope.solutionRows = [];
    $scope.selectedElementForIcon = '';
    $scope.solutionArray = [{solutionType: 'Select', solutionContent: [], solutionRows: [], solutionCols: []}];
    $scope.dataObj = {};
    $scope.questionTitleContents = [];
    $scope.showModelSolutionContent = false;
    $scope.showSidebysideSolutionContent = false;
    $scope.editMode = false;
    $scope.disableFillTextBox = false;
    function isEmpty(obj) {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    };
    $scope.createFinalDataObj = function () {

        $scope.dataObj = {
            "modelSolutionContent": {},
            "sidebysideSolutionContent": {},
            "operation": $scope.questionMetaData.qsTypeSelected,
            "additionTypes": $scope.questionMetaData.multiplicationType,
            "questionName": $scope.questionMetaData.title,
            "questionContent": [],
            "choices": [],
            "choiceType": $scope.questionMetaData.choiceTypeSelected,
            "choiceCount": ""
        };
        for (var x = 0; x < $scope.ritems.length; x++) {
            for (var y = 0; y < $scope.ritems[x].cols.length; y++) {
                $scope.dataObj.questionContent.push({
                    "row": x + 1,
                    "col": y + 1,
                    "value": $scope.ritems[x].cols[y].value,
                    "isMissed": $scope.ritems[x].cols[y].checked
                })
            }
            ;

        }
        ;
        $scope.populatingModelSolution();

        $scope.solutionArray.forEach(function (obj) {
            if (obj.solutionType == 'Model') {
                $scope.dataObj.modelSolutionContent = obj;

            } else if (obj.solutionType == 'Side By Side') {
                $scope.dataObj.sidebysideSolutionContent = obj;
            }
        });
        $scope.creatingModelSolution();
        $scope.creatingSideBySideSolution();
    };
    $scope.populateChoiceArray = function () {
        var choiceSelected = $scope.questionMetaData.choiceTypeSelected;

        if (choiceSelected != 'Fill') {
            if (choiceSelected == 'Multi Select') {
                if ($scope.choices.length == 1 && $scope.choices[0].choice == '') {
                    alert('Please add atleast one choice');
                    return false;
                }
            }
            ;
            var duplicates = [];
            var emptyChoices = [];
            $scope.choices.forEach(function (val) {
                if(val.choice == ""){
                    emptyChoices.push(true);
                };
                if (!duplicates.includes(val.choice)) {
                    duplicates.push(val.choice);
                }
            });
            if(emptyChoices.length >0){
                alert("Choice values cannot be empty");
                return;
            }
            if (duplicates.length != $scope.choices.length) {
                alert('Please remove duplicate choices');
                return false;
            }
            ;

            for (var i = 0; i < $scope.choices.length; i++) {
                $scope.dataObj.choices.push($scope.choices[i].choice);
            }
            ;

            $scope.dataObj.choiceCount = $scope.dataObj.choices.length;
        }
        ;


        return true;
    };
    $scope.getColumnData = function (colData, rowData) {
        var colArray = [];
        for (var i = 0; i < colData.length; i++) {
            colArray.push({col1: i + "-" + rowData.length, value: '', checked: false});

        }
        return colArray;
    }
    $scope.addRow = function () {
        if ($scope.citems.length == 0) {
            $scope.citems.push({
                col1: $scope.citems.length + "-" + $scope.ritems.length,
                value: '', checked: false,
                answer: ""
            });
        };
        $scope.ritems.push({
            row1: $scope.ritems.length,
            hint: "",
            cols: $scope.getColumnData($scope.citems, $scope.ritems)
        });

    };
    $scope.addColumn = function () {
        $scope.citems.push({
            col1: $scope.citems.length + "-" + $scope.ritems.length,
            value: '',
            checked: false,
            answer: ""
        });
        for (var i = 0; i < $scope.ritems.length; i++) {
            $scope.ritems[i].cols.push({
                col1: $scope.citems.length + "-" + $scope.ritems[i].row1,
                value: '',
                checked: false,
                answer: ""
            })
        }
        ;
    };
    $scope.addChoice = function () {
        if($scope.questionMetaData.choiceTypeSelected == 'Multi Select' && $scope.choices.length == 4)
            return;
        $scope.choices.push({choice: '', answer: '', index: 999});
    };
    $scope.checkboxClick = function (val, idx) {
        var obj = idx;
        var choiceSelected = $scope.questionMetaData.choiceTypeSelected;
        if (choiceSelected == 'Multi Select') {
            $scope.ritems.forEach(function (row) {
                row.cols.forEach(function (col) {
                    if (col.col1 != obj.col1) {
                        col.checked = false;
                        var idx = $scope.choices.findIndex(function (element) {
                            return (col.value == element.choice && element.answer == true);
                        });
                        if (idx != -1)
                            $scope.choices.splice(idx, 1);
                    }

                })
            })
        }
        var found = $scope.ritems.find(function (element) {
            return element.row1 == val.row1;
        });
        var col = found.cols.find(function (ele) {
            return ele.col1 == idx.col1
        });
        if(col.checked){
            return;
        }else{
            col.checked = true;
        }
        if (col.checked) {
            var isValueEmpty = $scope.choices.find(function (element) {
                return element.choice == '';
            });

            if (isValueEmpty) {
                isValueEmpty.choice = col.value;
                isValueEmpty.answer = true;
            } else {
                $scope.choices.push({choice: col.value, answer: true, index: 999});
            }
        } else {
            var idx = $scope.choices.findIndex(function (element) {
                return (col.value == element.choice && element.answer == true);
            });
            if (idx != -1) {
                if ($scope.choices[idx].index == 1) {
                    $scope.choices[idx].choice = "";
                    $scope.choices[idx].answer = false;
                } else {
                    $scope.choices.splice(idx, 1);
                }
            }

        }
        ;
        var addChoiceIdx = $scope.choices.findIndex(function(ch){
            return(ch.index == 1);
        });

        if(addChoiceIdx==-1){
            $scope.choices.unshift({choice: '', answer: '', index: 1});
        };

    };
    $scope.removeRow = function (obj, dataArray) {
        var found = dataArray.findIndex(function (element) {
            return element.row1 == obj.row1;
        });
        dataArray[found].cols.forEach(function(col){
            if(col.checked){
                var choiceValIndx = $scope.choices.findIndex(function(ch){
                    return(ch.choice == col.value);
                });
                if(choiceValIndx != -1)
                    $scope.choices.splice(choiceValIndx,1);

            }
        })
        if (dataArray.length == 1) {
            $scope.citems = [];
        }
        ;
        var addChoiceIdx = $scope.choices.findIndex(function(ch){
            return(ch.index == 1);
        });

        if($scope.choices.length==0 || addChoiceIdx==-1){
            $scope.choices.unshift({choice: '', answer: '', index: 1});
        };
        dataArray.splice(found, 1);
    };
    $scope.choiceVisibility = function () {
        var choiceSelected = $scope.questionMetaData.choiceTypeSelected;
        if ((choiceSelected == 'Fill') || (choiceSelected == 'Select')) {
            return false
        }
        ;
        return true;
    };
    $scope.appendQuesTitle = function () {
        var titleBody = '<div style="padding-top:8%">';
        titleBody += $scope.questionMetaData.title;
        titleBody += '</div>';
        $('#questionName').html(titleBody);
    };
    $scope.populatingModelSolution = function(){
        var obj = $scope.solutionArray.find(function(sol){
            return (sol.solutionType == "Model")
        });

        if(obj){
            obj.solutionContent.forEach(function(sol){
                var id = 'line'+sol.line;
                sol.value = document.getElementById(id).innerHTML
            })
        }
    };
    $scope.validationCheck = function () {

        $scope.dataObj = {};
        $scope.questionMetaData.title = $("#questionTitle").html().trim();

        var choiceSelected = $scope.questionMetaData.choiceTypeSelected;
        $scope.createFinalDataObj();
        var missedElements = [];
        var dataBoxes = [];
        var emptyBoxes = [];
        //Validating the data
        $scope.dataObj.questionContent.forEach(function (element) {
            if(element.value != ''){
                dataBoxes.push(true);
            };

            if(element.value == ""){
                emptyBoxes.push(true);
            }

            if (element.isMissed == true) {
                missedElements.push(element.value);
            }
            ;
        });
        if ($scope.questionMetaData.qsTypeSelected == '' || $scope.questionMetaData.qsTypeSelected == 'Select') {
            alert('Please select Question Type');
            return;
        }
        ;
        if ($scope.questionMetaData.multiplicationType == '' || $scope.questionMetaData.multiplicationType == 'Select') {
            alert('Please select Multiplication Type');
            return;
        }
        ;
        if (choiceSelected == '' || choiceSelected == 'Select') {
            alert('Please Select Choice Type');
            return;
        }
        ;
        if($scope.questionMetaData.title == ''){
            alert('Please provide Question Name');
            return;
        }
        ;
        if($scope.dataObj.questionContent.length==0){
            alert('You have not created any question');
            return;
        }
        ;
        if(dataBoxes.length == 0){
            alert("Please enter values in question content boxes");
            return;
        };
        if(emptyBoxes.length>0 && $scope.questionMetaData.multiplicationType == 'Horizontal'){
            alert("Please enter values in all the question content boxes");
            return;
        };
        if (missedElements.length == 0) {
            alert('Please select atleast one value as missed');
            return;
        }
        ;


        var choiceRepeated = false;
        if(choiceSelected == 'Multi Select' && $scope.choices.length!= 4){
            alert('Please choose 4 choices for the question');
            return
        };
        if (!choiceRepeated) {
            var status = $scope.populateChoiceArray();

            if (status) {
                if($scope.solutionArray[0].solutionType=='Select'){
                    alert('Please provide atleast one solution for question');
                    return;
                };
                if($scope.dataObj.modelSolutionContent &&
                    $scope.dataObj.modelSolutionContent.solutionContent &&
                    $scope.dataObj.modelSolutionContent.solutionContent.length==0){
                    alert('Please add solution line for model solution');
                    return;
                };
                if($scope.dataObj.modelSolutionContent &&
                    $scope.dataObj.modelSolutionContent.solutionContent &&
                    $scope.dataObj.modelSolutionContent.solutionContent.length>0){
                    var blankAns = [];
                    $scope.dataObj.modelSolutionContent.solutionContent.forEach(function(ob){
                        if(ob.value == ""){
                            blankAns.push(true) ;
                        }
                    });
                    if(blankAns.length>0){
                        alert("Solution Line in Model solution cannot be empty");
                        return;
                    }
                };
                if($scope.dataObj.sidebysideSolutionContent &&
                    $scope.dataObj.sidebysideSolutionContent.solutionRows &&
                    $scope.dataObj.sidebysideSolutionContent.solutionRows.length==0){
                    alert("Please add row for solution content");
                    return;
                }

                if($scope.dataObj.sidebysideSolutionContent &&
                    $scope.dataObj.sidebysideSolutionContent.solutionRows &&
                    $scope.dataObj.sidebysideSolutionContent.solutionRows.length>0){
                    var boxAns = [];
                    $scope.dataObj.sidebysideSolutionContent.solutionRows.forEach(function(ob){
                        ob.cols.forEach(function(col){
                            if(col.value!=""){
                                boxAns.push(true)
                            }
                        })
                    });

                    if(boxAns.length == 0){
                        alert("All the boxes in solution cannot be empty");
                        return;
                    };

                };

                $scope.appendQuesTitle();
                if (choiceSelected == 'Drag And Drop')
                    $scope.addDragableEements();
                $('#exampleModal').modal('show');

            }
        }


        ;

    };
    $scope.checkForSpecialCharacters = function(str,$event,value){

        var splRegex = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
        var isSplChar = splRegex.test(str);
        var isSplCharInValue = splRegex.test(value);

        if(isSplCharInValue){
            $event.preventDefault();
            return false;
        };
        if(isSplChar && value.length>0){
            $event.preventDefault();
            return false;
        };


    }
    $scope.limitKeypress = function ($event, obj, row, sol, id) {
        var splRegex = /[`~!@#$%^&*&times()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
        var regex = new RegExp("^[a-zA-a]+$");
        var str = String.fromCharCode(!$event.charCode ? $event.which : $event.charCode);

        if(sol&&sol.solutionType == 'Model'){

        }else{
            $scope.checkForSpecialCharacters(str,$event,obj.value);
        }
        if (regex.test(str)) {
            if(sol&&sol.solutionType == 'Model'){

            }else{
                $event.preventDefault();
                return false;
            }

        } else if ($scope.questionMetaData.multiplicationType == 'Vertical' && !sol) {

            if (obj.value != undefined && obj.value.length > 0) {
                $event.preventDefault();
                return false;
            }
        }
        ;


        if (sol) {
            if (sol.solutionType == 'Side By Side') {
                $scope.solutionArray.forEach(function (elem) {
                    if (elem.solutionType == sol.solutionType) {
                        elem.solutionRows.forEach(function (elemrow) {
                            if (elemrow.row1 == row.row1) {
                                elemrow.cols.forEach(function (elemcol) {
                                    if (elemcol.col1 == obj.col1) {
                                        elemcol.value = str;
                                        elemcol.type = 'text';
                                    }
                                })
                            }

                        })
                    }
                })
            } else if (sol.solutionType == 'Model') {
                $scope.solutionArray.forEach(function (elem) {
                    if (elem.solutionType == sol.solutionType) {
                        elem.solutionContent.forEach(function (data) {
                            if (data.line == obj.line) {
                                data.value = $("#" + id).html() + str;
                            }
                        })
                    }
                })
            }

        }


    };
    $scope.addSolution = function () {
        $scope.solutionVisibility = true;
    };
    $scope.addSolutionLine = function (obj, idx) {
        obj.solutionContent.push({value: "", line: obj.solutionContent.length});
    };
    $scope.addSolutionRow = function (obj) {
        if (obj.solutionCols.length == 0) {
            obj.solutionCols.push({col1: obj.solutionCols.length + "-" + obj.solutionRows.length, value: ''});

        }
        obj.solutionRows.push({
            row1: obj.solutionRows.length,
            cols: $scope.getColumnData(obj.solutionCols, obj.solutionRows)
        });
    };
    $scope.addSolutionCol = function (obj) {
        obj.solutionCols.push({col1: obj.solutionCols.length + "-" + obj.solutionRows.length, value: ''});
        for (var i = 0; i < obj.solutionRows.length; i++) {
            obj.solutionRows[i].cols.push({col1: obj.solutionCols.length + "-" + obj.solutionRows[i].row1, value: '',})
        }
        ;
    };
    $scope.showSymbolModalPopup = function (col, type, id, row) {
        var flag = true;
        if ($scope.questionMetaData.multiplicationType == 'Vertical' && type == 'Q') {
            var found = $scope.ritems.find(function (element) {
                return element.row1 == row.row1;
            });
            var colIndex = found.cols.findIndex(function (ele) {
                return ele.col1 == col.col1
            });
            if (colIndex != 0) {
                flag = false;
            }
        }
        ;
        if (flag) {
            col.type = type;
            col.row = row;
            col.id = id;
            $scope.selectedColForSymbol = col;
            $('#symbolModal').modal('show');
        }


    };
    $scope.showIconModalPopup = function (elemId, col, type, row) {
        if (col) {
            col.type = type;
            col.row = row;
            col.id = elemId;
            $scope.selectedElementForIcon = col;
        } else {
            $scope.selectedElementForIcon = {};
            $scope.selectedElementForIcon.id = elemId;
        }

        $('#iconModal').modal('show');
    };
    $scope.selectSymbol = function (val) {
        var splRegex = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
        var isSplChar = splRegex.test(val);


        if ($scope.selectedColForSymbol.type == 'M') {
            $scope.solutionArray.forEach(function (elem) {
                if (elem.solutionType == 'Model') {
                    elem.solutionContent.forEach(function (data) {
                        if (data.line == $scope.selectedColForSymbol.line) {
                            var str = $("#line" + $scope.selectedColForSymbol.line).html() + val;
                            data.value = str;
                            var e = document.getElementById('line' + $scope.selectedColForSymbol.line);
                            e.innerHTML = str;
                            $("#line" + $scope.selectedColForSymbol.line).focus();
                        }
                    })
                }
            })
        } else if ($scope.selectedColForSymbol.type == 'S') {
            $scope.solutionArray.forEach(function (elem) {
                if (elem.solutionType == 'Side By Side') {
                    elem.solutionRows.forEach(function (elemrow) {
                        if (elemrow.row1 == $scope.selectedColForSymbol.row) {
                            elemrow.cols.forEach(function (elemcol) {

                                if (elemcol.col1 == $scope.selectedColForSymbol.col1) {
                                    var e = document.getElementById($scope.selectedColForSymbol.id);
                                    if(isSplChar){
                                        var str = val;
                                    }else{
                                        var str = $("#" + $scope.selectedColForSymbol.id).html() + val;
                                    }
                                    elemcol.value = str;
                                    e.innerHTML = str;
                                }
                            })
                        }

                    })
                }
            })
        }
        ;
        $scope.selectedColForSymbol.value = val;


        $('#symbolModal').modal('hide');
    };
    $scope.insertImg = function (url) {
        var x = document.createElement("IMG");
        x.setAttribute("src", url);
        x.setAttribute("width", '25px');
        x.setAttribute("height", '25px');
        x.setAttribute("margin-left",'30px');
        x.style.margin = '5px';
        document.getElementById($scope.selectedElementForIcon.id).appendChild(x);

        if ($scope.selectedElementForIcon.type == 'S') {
            $scope.solutionArray.forEach(function (elem) {
                if (elem.solutionType == 'Side By Side') {
                    elem.solutionRows.forEach(function (elemrow) {
                        if (elemrow.row1 == $scope.selectedElementForIcon.row) {
                            elemrow.cols.forEach(function (elemcol) {
                                if (elemcol.col1 == $scope.selectedElementForIcon.col1) {
                                    elemcol.value ="<img src="+url+" width='25px' height='25px'>";
                                    elemcol.type = 'img';
                                }
                            })
                        }

                    })
                }
            })
        } else if ($scope.selectedElementForIcon.type == 'M') {
            $scope.solutionArray.forEach(function (elem) {
                if (elem.solutionType == 'Model') {
                    elem.solutionContent.forEach(function (data) {
                        if (data.line == $scope.selectedElementForIcon.line) {
                            var str = $("#line" + $scope.selectedElementForIcon.line).html();
                            data.value = str;
                            $("#line" + $scope.selectedElementForIcon.line).focus();

                        }
                    })
                }
            })
        }

        //$('#iconModal').modal('hide');
    };
    $scope.onSubmit = function () {
        //Final data Object
        var dataJsonObj = $scope.dataObj;

        var url = window.location.href;
        if(!(url.includes("edit")))
        window.location = url+"?edit=true";
        $('#exampleModal').modal('hide');
    };
    $scope.getDataTableStyle = function () {
        if ($scope.dataObj &&
            $scope.dataObj.sidebysideSolutionContent
            &&
            $scope.dataObj.sidebysideSolutionContent.solutionType == 'Side By Side') {
            return {width: '30%', float: 'left'}
        } else {
            return {width: '100%'}
        }
    };
    $scope.addMoreSolution = function () {
        $scope.solutionArray.push({solutionType: 'Select', solutionContent: [], solutionRows: [], solutionCols: []});
    };
    $scope.removeChoice = function (obj) {
        var found = $scope.choices.findIndex(function (element) {
            return (element.choice == obj.choice && element.answer == obj.answer);
        });
        $scope.choices.splice(found, 1);
    };
    $scope.creatingSideBySideSolution = function(){
        if ($scope.dataObj.sidebysideSolutionContent){
            if($scope.dataObj.sidebysideSolutionContent.solutionRows){
                var data = $scope.dataObj.sidebysideSolutionContent.solutionRows;
                var table_body = '<table>';
                for(var i =0;i<data.length;i++){
                    if(i==data.length-1 && data.length>2){
                        table_body +='<tr style="border-top:1px solid grey;border-bottom:1px solid grey">';
                    }else{
                        table_body +='<tr>';

                    }
                    for(var x =0;x<data[i].cols.length;x++){
                        table_body +='<td class="solutionTd">';
                        table_body += data[i].cols[x].value;
                        table_body +='</td>';
                    }
                    table_body +='</tr>';
                }
                table_body +='</table>';
                $('#sidebysideSolutionContent').html(table_body);
            }
        }
    }
    $scope.creatingModelSolution = function () {
        if ($scope.dataObj.modelSolutionContent) {
            if ($scope.dataObj.modelSolutionContent.solutionContent) {
                var data = $scope.dataObj.modelSolutionContent.solutionContent;
                var table_body = '<table style="margin:0 auto;width:50%">';
                for (var i = 0; i < data.length; i++) {
                    table_body += '<tr>';
                    table_body += '<td>';
                    table_body += data[i].value;
                    table_body += '</td>';
                    table_body += '</tr>';
                }
                table_body += '</table>';
                $('#modelSolutionContent').html(table_body);
            }
        }
    };
    $scope.addDragableEements = function () {
        $scope.choices.forEach(function (ob) {
            //$("#choice"+ob.choice).draggable()gab
            $(".dummy").draggable();
            $(".dummy").draggable({
                revert: "invalid",
                revert: "invalid",
                helper: "clone",
            });
        });

        $scope.ritems.forEach(function (row) {
            row.cols.forEach(function (col) {
                if (col.checked == true) {
                    $("#data" + col.value).droppable({
                        activeClass: "ui-state-default",
                        hoverClass: "ui-state-hover",
                        drop: function (event, ui) {
                            $(this).empty();
                            ui.draggable.clone().appendTo($(this));
                            var val = $(ui.draggable).attr("id");
                            col.answer = document.getElementById(val+'elem').innerHTML;
                            col.answer = col.answer.trim();

                        }
                    })
                }
            })
        })

    };
    $scope.choiceSelected = function (ch) {
        ch.selected = ch.choice;
        if ($scope.questionMetaData.choiceTypeSelected == 'Multi Select') {
            $scope.ritems.forEach(function (row) {
                row.cols.forEach(function (col) {
                    if (col.checked == true) {
                        col.answer = ch.choice;
                    }
                })
            })
        }
        ;
        $scope.choices.forEach(function (ob) {
            var classValid = $('#choice' + ob.choice).hasClass("choiceSelected");
            if (classValid) {
                $('#choiceDiv'+ob.choice).css("background-image","url('images/choices.png')");
                $('#choice' + ob.choice).removeClass("choiceSelected");
            }
            ;
        })
        $('#choiceDiv'+ch.choice).css("background-image","url('images/selected-option.png')");
        $('#choice' + ch.choice).addClass('choiceSelected');
    };
    $scope.removeCol = function (idx) {
        $scope.ritems.forEach(function (row) {
            var colValue = row.cols[idx];
            if(colValue.checked){
                var choiceValIndx = $scope.choices.findIndex(function(ch){
                    return(ch.choice == colValue.value);
                });
                if(choiceValIndx != -1)
                $scope.choices.splice(choiceValIndx,1);

            }
            row.cols.splice(idx, 1);
        });
        var addChoiceIdx = $scope.choices.findIndex(function(ch){
            return(ch.index == 1);
        });

        if($scope.choices.length==0 || addChoiceIdx==-1){
            $scope.choices.unshift({choice: '', answer: '', index: 1});
        };
        $scope.citems.splice(idx, 1);
        if ($scope.ritems[0].cols.length == 0) {
            $scope.ritems = [];
        }
    };
    $scope.verifyTheAnswer = function () {
        var verified = true;
        var wrongAns = [];
        var emptyAns = [];
        $scope.ritems.forEach(function (row) {
            row.cols.forEach(function (col) {
                if (col.checked == true) {
                    if (col.answer == "" || col.answer == undefined) {
                        emptyAns.push(true);
                    }
                    if (col.answer && col.answer != col.value) {
                        wrongAns.push(col.answer);
                    }
                    ;
                }
            });


        });
        if (emptyAns.length > 0) {
            alert('Please enter values in empty box');
        } else if (wrongAns.length > 0) {
            alert('Entered Value is incorrect');
            if(isEmpty($scope.dataObj.modelSolutionContent)){
                $scope.showModelSolutionContent = false;
            }else{
                $scope.showModelSolutionContent = true;
            };

            if(isEmpty($scope.dataObj.sidebysideSolutionContent)){
                $scope.showSidebysideSolutionContent = false;
            }else{
                $scope.showSidebysideSolutionContent = true;
            }
            document.getElementById('choicesContainer').style.display = "none";
            $scope.disableFillTextBox = true;

        } else {
            alert('Answer is correct');
            $scope.submitBtnDisabled = false;
        }
    };
    $scope.previewKeyPress = function ($event) {
        var regex = new RegExp("^[a-zA-a]+$");
        var str = String.fromCharCode(!$event.charCode ? $event.which : $event.charCode);
        if (regex.test(str)) {
            $event.preventDefault();
            return false;
        }
        ;
        return true;
    };
    $scope.removeSolutionLine = function (arg1, arg2) {
        if (arg2.solutionType == 'Model') {
            var idx = arg2.solutionContent.findIndex(function (elem) {
                return (elem.line == arg1.line)
            });
            if (idx != -1) {
                arg2.solutionContent.splice(idx, 1)
            }
        }
        var x = 'fsf';
    };
    $scope.disableAddCol = function () {
        if ($scope.ritems.length > 0) {
            return false;
        }
        ;
        return true;
    };
    $scope.checkForCondition = function (row, col) {
        if ($scope.questionMetaData.multiplicationType == 'Vertical') {
            if ((col.col1 == "0-0")) {
                return true;
            }
        }
        ;
        return false;
    };
    $scope.disbableRadioBtn = function(row,col){
        if ($scope.questionMetaData.multiplicationType == 'Vertical') {
            if ((col.col1 == "0-0")) {
                return true;
            }
        }
        ;
        if(col.value == ""){
            return true;
        };
        return false;
    }
    $scope.removeSolutionCol = function (idx, array) {
        array.solutionRows.forEach(function (row) {
            row.cols.splice(idx, 1);
        });
        array.solutionCols.splice(idx,1);
        if (array.solutionRows[0].cols.length == 0) {
            $scope.solutionArray.forEach(function (sol) {
                if (sol.solutionType == 'Side By Side') {
                    sol.solutionRows = [];
                    sol.solutionCols = [];
                }
            })
        }
    };
    $scope.disableSolutionAddCol = function (obj) {
        if (obj.solutionRows.length > 0) {
            return false;
        }
        ;
        return true;
    };
    $scope.getStyleObj = function(){
        if($scope.questionMetaData.choiceTypeSelected == 'Drag And Drop'){
            return 'dragBox'
        };
        return 'choiceStyle'
    };
    $scope.choiceTypeSelected = function(){
        if($scope.editMode && $scope.questionMetaData.choiceTypeSelected !="Fill"){
            $scope.ritems.forEach(function(ob){
                ob.cols.forEach(function(col){
                    if(col.checked){
                        var idx = $scope.choices.findIndex(function(element){
                           return(col.value == element.choice)
                        });
                        if(idx == -1){
                            var idxValue = $scope.choices.length == 0?1:999;
                            $scope.choices.push({choice:col.value, answer:true, index:idxValue});
                        }

                    }
                })

            })
            if($scope.choices.length==0){
                $scope.choices = [{choice: '', answer: '', index: 1}];
            }
        }
    };
    $scope.init = function(){
        var tempData = [];
        var edit = window.location.href.split("?");

       if(edit[1] == 'edit=true'){
           //static code
           $scope.editMode = true;

           var obj = {additionTypes: "Horizontal",
               choiceCount: 4,
               choiceType: "Fill",
               choices: []/*["8", "9", "10", "11"]*/,
               modelSolutionContent: {solutionType: "Model",
                   solutionContent:[ {value: "<img src='images/circle-blue.png' width='25px' height='25px'>", line: 0, type: "M"},
                       {value: "1223444444", line: 1, type: "M"},
                       {value: "1223", line: 2, type: "M"},
                       {value: "12234444", line: 3, type: "M"}]},
               operation: "Multiplication",
               questionContent:  [{row: 1, col: 1, value: "1", isMissed: false},
               {row: 1, col: 2, value: "2", isMissed: false},
           {row: 1, col: 3, value: "3", isMissed: false},
           {row: 1, col: 4, value: "4", isMissed: false},
           {row: 2, col: 1, value: "5", isMissed: false},
           {row: 2, col: 2, value: "6", isMissed: false},
           {row: 2, col: 3, value: "7", isMissed: false},
            {row: 2, col: 4, value: "8", isMissed: true}],
           questionName:"\"helllowwwww<img src=\"images/circle-blue.png\" width=\"25px\" height=\"25px\">dffddfdfdfdf<img src=\"images/heart-blue.png\" width=\"25px\" height=\"25px\">\"\n",
           sidebysideSolutionContent: {solutionCols:[ {col1: "0-0", value: ""},
                   {col1: "1-1", value: ""},
           {col1: "2-1", value: ""}],
           solutionContent: [],
           solutionRows: [{cols:[{col1: "0-0", value: "<img src='images/circle-blue.png' width='25px' height='25px'>", checked: false, type: "img"},
          {col1: "2-0", value: "2", type: "text"},
           {col1: "3-0", value: "3", type: "text"},
          ],
           row1: 0}],
           solutionType: "Side By Side"}};
           var solutionPresent = (!(isEmpty(obj.modelSolutionContent))) || (!(isEmpty(obj.sidebysideSolutionContent)))?true:false;
           if(solutionPresent){
               $scope.solutionArray = [];
           }
           $scope.title = obj.questionName;
           $scope.questionMetaData['multiplicationType'] = obj.additionTypes;
           $scope.questionMetaData['qsTypeSelected'] = obj.operation;
           $scope.questionMetaData['choiceTypeSelected'] = obj.choiceType;
           if(!(isEmpty(obj.modelSolutionContent))){
               $scope.solutionArray.push(obj.modelSolutionContent);
               $scope.solutionVisibility = true;
           };
           if(!(isEmpty(obj.sidebysideSolutionContent))){
               $scope.solutionArray.push(obj.sidebysideSolutionContent);
               $scope.solutionVisibility = true;

           };

           if(obj.questionContent && obj.questionContent.length>0){

               obj.questionContent.forEach(function(qs){

                   var rowObj = tempData.find(function(r){
                       return(r.row1 == (qs.row-1))
                   });
                   if(!rowObj){

                       tempData.push({row1:qs.row - 1,cols:[{col1:qs.col+"-"+qs.row,value:qs.value,checked:qs.isMissed}]});

                   }else{

                       rowObj.cols.push({col1:qs.col+"-"+qs.row,value:qs.value,checked:qs.isMissed})
                   }
               });
               $scope.ritems = tempData;

           };
           $scope.ritems[0].cols.forEach(function(){
               $scope.citems.push({
                   col1:"",
                   value: '',
                   checked: false,
                   answer: ""
               });
           });
           $scope.choices = [];
           if(obj.choices && obj.choices.length>0){

               obj.choices.forEach(function(val){
                   var idxValue = $scope.choices.length == 0?1:999;
                   $scope.choices.push({choice:val, answer: '', index:idxValue});
               })
           };
           if($scope.title){
               var titleBody = '<span>';
               titleBody += $scope.title;
               titleBody += '</span>';
               $('#questionTitle').html(titleBody);
           };
       }
    };
    $window.onload = function() {
        var modelSolution = $scope.solutionArray.find(function(ob){
            return ob.solutionType == 'Model';
        });

        var sidebyside = $scope.solutionArray.find(function(ob){
            return ob.solutionType == 'Side By Side';
        });
        if(sidebyside){
            sidebyside.solutionRows.forEach(function(row){
                row.cols.forEach(function(col,idx){
                    var titleBody = '<span>';
                    titleBody += col.value;
                    titleBody += '</span>';
                    $("#box"+idx+col.col1).html(titleBody);
                })
            })
        }

        if(modelSolution){
            modelSolution.solutionContent.forEach(function(sol){
                var titleBody = '<span>';
                titleBody += sol.value;
                titleBody += '</span>';
                $("#line"+sol.line).html(titleBody);
                //$("#line"+sol.line).text(sol.value);
            })
        }
    };
    $scope.getColumnBorder = function(idx){
        if($scope.questionMetaData.multiplicationType == 'Vertical' && $scope.ritems.length>1){
            if((idx+1) == $scope.ritems.length){
                return {"border-top":"1px solid grey","border-bottom":"1px solid grey"}
            }
        }

    };
    $scope.getSolutionColumnBorder = function(idx,sol){
        if(sol.solutionType == 'Side By Side' && sol.solutionRows.length>2){
            if((idx+1) == sol.solutionRows.length  ){
                return {"border-top":"1px solid grey","border-bottom":"1px solid grey"}
            }
        }

    };
    $scope.removeSolution = function(sol){
        var idx = $scope.solutionArray.findIndex(function(ob){
            return(ob.solutionType == sol.solutionType)
        });

        $scope.solutionArray.splice(idx,1);
        if($scope.solutionArray.length==0){
            $scope.solutionVisibility = false;
            $scope.solutionArray = [{solutionType: 'Select', solutionContent: [], solutionRows: [], solutionCols: []}];
        }
    };
    $scope.selectSolutionType = function(sol,type){
        if(type == 'Model'){
            sol.solutionCols = [];
            sol.solutionRows = [];
        }else if(type == 'Side By Side'){
            sol.solutionContent = [];
        }
    };
    $scope.testFunc = function(event,cols,row,id,type){
        var KeyID = event.keyCode;
        switch(KeyID)
        {
            case 8:
            case 46:
                if(type == 'S'){
                    var obj = $scope.solutionArray.find(function(sol){
                        return (sol.solutionType == "Side By Side")
                    });
                    obj.solutionRows.forEach(function (elemrow) {
                        if (elemrow.row1 == row.row1) {
                            elemrow.cols.forEach(function (elemcol) {
                                if (elemcol.col1 == cols.col1) {
                                    elemcol.value = document.getElementById(id).innerHTML;
                                    elemcol.value = elemcol.value.trim().substring(0,elemcol.value.trim().length-1);
                                    elemcol.type = 'text';
                                }
                            })
                        }

                    })
                }

                break;
            default:
                break;
        }
    };
    $scope.disableSolutionButton = function(){
        var valueBox = [];
        if($scope.ritems.length>0){
            $scope.ritems.forEach(function(elem){
                elem.cols.forEach(function(col){
                    if(col.value!="")
                        valueBox.push(col.value);
                })

            })
        };
        if(valueBox.length >0 ){
            return false;
        }
        return true;
    };
    $scope.populateImages = function(type){
        if(type == 'R'){
            $scope.images = $scope.redImages;
        }else if(type == 'Y'){
            $scope.images = $scope.yellowImages;
        }else if(type == 'G'){
            $scope.images = $scope.greenImages;
        }else if(type == 'B'){
            $scope.images = $scope.blueImages;

        }
    }
    $scope.init()

})


