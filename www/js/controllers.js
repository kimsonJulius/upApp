angular.module('starter.controllers', [])



    //use this for the side-menu items
    .controller('AppCtrl', function ($scope,$state, toastr, $http, $ionicModal) {
        //logout users..
        $scope.logout = function () {
            sessionStorage.clear();
            $state.go('login');
            toastr.success('Logged out successfully');
        };
        ///the suspended sales
        /*modal for changing customer..*/
        $ionicModal.fromTemplateUrl('templates/suspended.html',{
            scope:$scope,
            animation:'slide-in-right'
        }).then(function (suspended) {
            $scope.suspended = suspended;
        });

        $scope.closePaymentMod = function () {
            $scope.suspended.hide();
        };

        $scope.listSuspendedSale = function () {
            //
            $http({
                url:url+'/listSuspendedSale/'+sessionStorage.user_id,
                method:'GET'
            }).success(function (data) {
                //show modal and load suspended sales
                $scope.suspended.show();
                $scope.suspendeds = data.suspended;
                console.info(data)
            }).error(function (err) {
                console.error(err);
            })

        };
        $scope.unsuspend = function (item) {
            console.info(item);
            //load items from this suspended sale

        }
    })
//login controller
    .controller('loginController', function ($scope, $http, $ionicLoading,toastr,$state) {
        $scope.loginRetailer = function (user) {
            if(user == undefined || user.username == undefined || user.pin == undefined){
                toastr.error('Please enter login details');
                return;
            }
            $ionicLoading.show();
            $http({
                url:url + 'loginRetailer',
                method:'POST',
                headers:{'Content-Type': 'application/x-www-form-urlencoded'},
                data:user
            }).success(function (data) {
                $ionicLoading.hide();
                toastr.info(data.msg,data.status);
                if(data.status == 'success'){
                    //save session data..
                    sessionStorage.user_id = data.user.id;
                    sessionStorage.email = data.user.email;
                    sessionStorage.name = data.waiter.first_name +' '+ data.waiter.last_name;
                    sessionStorage.user_id = data.user.id;
                    //load business and branch to session
                    sessionStorage.business = data.business;
                    sessionStorage.branch = data.branch;
                    if(data.msg == 'Please verify your phone number')
                    {//go to verify phone
                        $state.go('verify')
                    }else
                    {
                        $state.go('app.dashboard');
                    }
                }
            }).error(function () {
                toastr.error('Check your internet connection and try again.');
                $ionicLoading.hide();
            })
        }
    })

    //sign up
    .controller('registerController', function ($scope, $state, $http, $ionicLoading, toastr,$ionicModal) {
        //modal with countries list.
        $ionicModal.fromTemplateUrl('templates/country.html',{
            scope:$scope,
            animation:'slide-in-right'
        }).then(function (countryModal) {
            $scope.countryModal = countryModal;
        });

        //load all countries
        $scope.countries = ["Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegowina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", "Congo, the Democratic Republic of the", "Cook Islands", "Costa Rica", "Cote d'Ivoire", "Croatia (Hrvatska)", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "France Metropolitan", "French Guiana", "French Polynesia", "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard and Mc Donald Islands", "Holy See (Vatican City State)", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran (Islamic Republic of)", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, Democratic People's Republic of", "Korea, Republic of", "Kuwait", "Kyrgyzstan", "Lao, People's Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libyan Arab Jamahiriya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia, The Former Yugoslav Republic of", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia, Federated States of", "Moldova, Republic of", "Monaco", "Mongolia", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russian Federation", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Seychelles", "Sierra Leone", "Singapore", "Slovakia (Slovak Republic)", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and the South Sandwich Islands", "Spain", "Sri Lanka", "St. Helena", "St. Pierre and Miquelon", "Sudan", "Suriname", "Svalbard and Jan Mayen Islands", "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic", "Taiwan, Province of China", "Tajikistan", "Tanzania, United Republic of", "Thailand", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "United States Minor Outlying Islands", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Virgin Islands (British)", "Virgin Islands (U.S.)", "Wallis and Futuna Islands", "Western Sahara", "Yemen", "Yugoslavia", "Zambia", "Zimbabwe"];
        $scope.selectList = function () {
            //show a modal for selecting from..
            $scope.countryModal.show();
        };
        $scope.selectListHide = function () {
            $scope.countryModal.hide();
        };
        $scope.changeCountrySelected = function (country) {
            console.info($scope.user);
            //$scope.user.country = country;
            $scope.countryModal.hide();
        };
        //load packages
        $http({
            url:url+'/loadPackages',
            method:'get'
        }).success(function (data) {
            $scope.packages = data.packages;
        });
        //register the new retailer
        $scope.registerRetailer = function (data) {
            //send the data to the server
            $ionicLoading.show();
            $http({
                url:url+'/postRegisterRetailer',
                method:'POST',
                headers:{'Content-Type': 'application/x-www-form-urlencoded'},
                data:data
            }).success(function (data) {
                //the response..
                if(data.status == 'success'){
                    toastr.success(data.message,data.status);
                }else if(data.status == 'error'){
                    toastr.error(data.message,data.status);
                }
                //take the user to login page
                $state.go('login');
                $ionicLoading.hide();
            })
        }
    })


    .controller('dashboardController', function ($scope, $http, $ionicLoading,toastr,$ionicModal,$ionicPopup,$state) {
        /*$scope.logout = function () {
            sessionStorage.clear();
            $state.go('login');
        };*/

        $scope.business = sessionStorage.business;
        $scope.branch = sessionStorage.branch;



        //suspend the sales
        $scope.suspend = function () {
          //record as sales suspended..
            if(! $scope.sale.customer){
                toastr.error('Please select a customer');
                return;
            }
            if(!$scope.shoppingList.length){
                toastr.error('Please add item to suspend');
                return;
            }
            $http({
                url:url+'/suspendSale/'+sessionStorage.user_id,
                data:/*$scope.shoppingList*/{myData : $scope.sale,mysale: $scope.shoppingList},
                method:'POST',
                headers:{'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                if(data.status == 'success'){
                    //clear the sale and sale list by reload
                    window.location.reload(true);
                }
                console.info(data);
            }).error(function (err) {
                console.error(err);
            })
        };


        //get the device location.

        // onSuccess Callback
        // This method accepts a Position object, which contains the
        // current GPS coordinates
        //
        var onSuccess = function(position) {
            //display the location of the device to the user
            //$scope.sale.lat = position.coords.latitude;
            $scope.sale.longi = position.coords.longitude;
            geoUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
            $http({
                url:geoUrl+ '?latlng='+position.coords.latitude+','+position.coords.longitude+'&key=AIzaSyDQEUIYxOHoGQA2QInEw4fRr6Fhuw8Ekwo',
                method:'GET'
            }).success(function (data) {
                console.info(data);
                $scope.sale.locationName = data['results'][0]['formatted_address'] ;
            })
        };

        // onError Callback receives a PositionError object
        //
        function onError(error) {
            alert('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');
        }

        navigator.geolocation.getCurrentPosition(onSuccess, onError);


        $scope.getItems = function () {
            var item_count = 0;
            var item_item_count = 0;
            for(var i=0; i<$scope.shoppingList.length; i++){
                item_count += 1;
                item_item_count += $scope.shoppingList[i].quantity;
            }return ' '+item_count+'('+item_item_count+')';
        };
        $scope.sale = {};
        $scope.sale.user_id = sessionStorage.user_id;
        $scope.getTotal = function () {
            var total = 0;
            var cost = 0;
            for(var i=0; i<$scope.shoppingList.length; i++){
                //calculate the selling price
                total += $scope.shoppingList[i].product_price * $scope.shoppingList[i].quantity;
                //calculate the cost price..
                cost += $scope.shoppingList[i].product_cost * $scope.shoppingList[i].quantity;
            }
            //the total sale price is
            $scope.sale.cost = cost;
            // if the seller allow some discount amount
                if($scope.sale.discount == undefined || $scope.sale.discount == '' || isNaN($scope.sale.discount)){
                   var discount = 0;
                }else{
                    discount = $scope.sale.discount;
                }
            total -= discount;
            //calculate tax amount..
            if($scope.sale.taxPercentage != undefined && $scope.sale.taxPercentage != ''
                && $scope.sale.taxPercentage != 0){
                $scope.sale.taxAmount = total * $scope.sale.taxPercentage / 100;
            }else{
                $scope.sale.taxAmount = 0;
            }


            total += $scope.sale.taxAmount;
            $scope.sale.totalPayable = total;
            return total;
        };

        $scope.getDueAmount = function () {
            if($scope.sale.TotalAmount == undefined){
                $scope.sale.TotalAmount = '';
            }
            $scope.sale.dueAmount = $scope.getTotal()-$scope.sale.TotalAmount;
            return   $scope.getTotal()-$scope.sale.TotalAmount;
        };

        $scope.getBalance = function () {
            if($scope.sale.TotalAmount == undefined){
                $scope.sale.TotalAmount = '';
            }
            $scope.sale.balance = $scope.sale.TotalAmount - $scope.getTotal();
            return  $scope.sale.TotalAmount - $scope.getTotal();
        };
        $scope.shoppingList = [];
        $scope.url = url;
        /*modal for listing inventory*/
        $ionicModal.fromTemplateUrl('templates/productslist.html',{
            scope: $scope,
            animation:'slide-in-right'
        }).then(function (proList) {
            $scope.proListModal = proList;
        });

        /*modal for making payment starts here..*/
        //$ionicModal.fromTemplateUrl('template')
        $ionicModal.fromTemplateUrl('templates/payment.html',{
            scope:$scope,
            animation: 'slide-in-right'
        }).then(function (payModal) {
            $scope.paymentModal = payModal;
        });

        /*modal for making payment starts here..*/
        //$ionicModal.fromTemplateUrl('template')
        $ionicModal.fromTemplateUrl('templates/rec.html',{
            scope:$scope,
            animation: 'slide-in-right'
        }).then(function (recModal) {
            $scope.recMl = recModal;
        });
        /*modal for making payment ends here..*/

        /*modal for changing customer..*/
        $ionicModal.fromTemplateUrl('templates/customer.html',{
            scope:$scope,
            animation:'slide-in-right'
        }).then(function (customerModal) {
            $scope.customerModal = customerModal;
        });




        $ionicLoading.show();
        $http({
            url:url+'loadRetailersDashboard/'+sessionStorage.user_id,
            method:'GET'
        }).success(function (data) {
            $scope.warehouses = data.warehouses;
            $scope.customers = data.customers;
            $scope.products = data.products;
            $ionicLoading.hide();
        }).error(function () {
            toastr.error('Check your internet connection and try again.');
            $ionicLoading.hide();
        });
        /*show the inventory*/
        $scope.add_product = function () {
            $scope.proListModal.show();
        };
        /*close the inventory listing modal*/
        $scope.closeProductList = function () {
            $scope.proListModal.hide();
            $scope.searchProd = '';
        };
        /*close the payment modal*/
        $scope.closePaymentMod = function () {
            $scope.paymentModal.hide();
        };
        /*add product to the shopping list*/
        $scope.addProd = function (item) {
            $scope.proListModal.hide();
            $scope.searchProd = '';
            item.quantity=1;
            $scope.shoppingList.push(item);
            //get the index
            $scope.products.splice($scope.products.indexOf(item),1);
            console.info($scope.shoppingList);
        };
        $scope.payForProds = function () {
            $scope.print = 0;
            /*check if there is items in the shopping list*/
            if(! $scope.shoppingList.length){
                toastr.error('Please add shopping list items');
                return;
            }

            $scope.paymentModal.show();
        };
        $scope.addQShoppingList = function (item) {
            item.quantity +=1;
        };
        $scope.deleteShoppingList = function (item) {
            /*check the quantity if one delete if greater than one decreament*/

            if(item.quantity >1){
                item.quantity -= 1;
                return;
            }
            $scope.products.push(item);
            $scope.shoppingList.splice($scope.shoppingList.indexOf(item),1);
        };
        $scope.updateQShoppingList = function (item) {
            // Triggered on a button click, or some other target
            var ind = $scope.shoppingList.indexOf(item);
            $scope.data = {};
            $scope.data.q = $scope.shoppingList[ind]['quantity'];
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<span>SKU Code:</span><br/>' +
                '<input type="text" style="text-align: center" ng-value="data.code" ng-model="data.code">' +
                '<span>Quantity:</span><br/>' +
                '<input type="number" style="text-align: center" ng-value="data.q" ng-model="data.q">',
                title: 'SKU SALE',/*
                 subTitle: 'Please use normal things',*/
                scope: $scope,
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Update</b>',
                        type: 'btn-myButton',
                        onTap: function(e) {
                            /*update quantity*/
                            $scope.shoppingList[ind]['quantity'] = $scope.data.q;
                            //check if there is already existing values for original price..
                            if($scope.shoppingList[ind]['original_price'] == undefined){
                                $scope.shoppingList[ind]['original_price'] = $scope.shoppingList[ind]['product_price']
                            }

                            /*ajax to get SKU factor..*/
                            if($scope.data.code != undefined && $scope.data.code != ''){
                                $http({
                                    url:url+'/getSKUFactory/'+$scope.data.code,
                                    method:'GET'
                                }).success(function (data) {
                                    if(data.hasFactor){
                                        $scope.shoppingList[ind]['product_price'] = data['product']['factor']
                                            * $scope.shoppingList[ind]['original_price'];
                                    }else{
                                        $scope.shoppingList[ind]['product_price'] = $scope.shoppingList[ind]['original_price'];
                                    }

                                }).error(function(error){
                                    toastr.error('Check your internet connection.');
                                })
                            }
                            $scope.shoppingList[ind]['product_price'] = $scope.shoppingList[ind]['original_price'];

                        }
                    }
                ]
            });
        };

       /* $scope.closeThisOrder = function () {

            for(var k in $scope.shoppingList){
                if($scope.shoppingList.hasOwnProperty(k)){
                    $scope.products.push({k: $scope.shoppingList[k]});
                    $scope.shoppingList.splice(k,1);
                }
            }
        };*/

        //go to view all orders
        $scope.goToOrders = function () {
            $state.go('app.orders')
        };


        //sell products with barcode..
        $scope.sellWithBarcode = function () {


            cordova.plugins.BarcodeScanner.scan(
                function (result) {
                    alert("We got a barcode\n" +
                        "Result: " + result.text + "\n" +
                        "Format: " + result.format + "\n" +
                        "Cancelled: " + result.cancelled);
                },
                function (error) {
                    alert("Scanning failed: " + error);
                }
            );

            cordova.plugins.barcodeScanner.scan(
                function (result) {
                    alert("We got a barcode\n" +
                        "Result: " + result.text + "\n" +
                        "Format: " + result.format + "\n" +
                        "Cancelled: " + result.cancelled);
                },
                function (error) {
                    alert("Scanning failed: " + error);
                }
            );

        };
        //set date
        $scope.date = new Date();
        //compute sale total price
        $scope.TotalAmount = function (shoppingList) {
            var tot = 0;
            console.info('the sale => ',shoppingList);
            for(var i=0; i<shoppingList.length; i++)
            {
                tot = tot + parseFloat(shoppingList[i]['product_price']) * parseFloat(shoppingList[i]['quantity']);
            }
            return tot;
        };

        $scope.removeShoppingList = function (item) {
            /*swipe to remove item*/
            $scope.products.push(item);
            $scope.shoppingList.splice($scope.shoppingList.indexOf(item),1);
        };
        $scope.sellProds = function (data) {
            //show receipt
            //validation..
            if($scope.sale.payBy == undefined || $scope.sale.payBy == ''){//payment option.
                toastr.error('Please select paying options');
                return; //must select the payment options
            }
            //cash should pay the whole amount..
            if($scope.sale.payBy == 'Cash' || $scope.sale.payBy == 'Cheque'
                || $scope.sale.payBy == 'Mpesa' || $scope.sale.payBy == 'Airtel Money'){
                //
                if($scope.sale.totalPayable > $scope.sale.TotalAmount){
                    toastr.error('Please pay the full amount');
                    return;
                }
            }
            //if mobile money..lazima trans. code
            if($scope.sale.payBy == 'Mpesa' || $scope.sale.payBy == 'Airtel Money'){
                if($scope.sale.trans_code == undefined || $scope.sale.trans_code == '')
                {
                    toastr.error('Please enter transaction code');
                    return;
                }
            }
            if($scope.sale.payBy == 'Cheque'){
                if($scope.sale.cheque_no == undefined || $scope.sale.cheque_no == '')
                {
                    toastr.error('Please enter cheque number');
                    return;
                }
            }
            if($scope.sale.payBy == 'Credit'){
                if($scope.sale.due_date == undefined || $scope.sale.due_date == '')
                {
                    toastr.error('Please set due date');
                    return;
                }
            }
            //select the customer
            if($scope.sale.customer == undefined){
                toastr.error('Please select a customer');
                return;
            }
            //$scope.
            $ionicLoading.show();
            $http({
                url:url+'/sellProds/'+sessionStorage.user_id,
                data:/*$scope.shoppingList*/{myData : $scope.sale,mysale: $scope.shoppingList},
                method:'POST',
                headers:{'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function (data) {
                /**/
                console.info(data);
                //$scope.paymentModal.hide();
                $ionicLoading.hide();
                /*receipt preview..*/
                //$scope.recMl.show();
                toastr.success('Successfully sold');
                $scope.print =1;
            }).error(function (error) {
                console.error(error);
                toastr.error(error);
                $ionicLoading.hide();
                //$scope.paymentModal.hide();
            });

        };
        /*cancel order*/
        $scope.cancelOrder = function () {
            //
        };
        /*change warehouse.*/
        $scope.changeWarehouse = function () {
            //alert('closer');
            $scope.customerModal.show();
        };

        /*change customer.*/
        $scope.changeCustomer = function () {
            $scope.customerModal.show();
        };
        /*actually change the customer..*/
        $scope.changeCustomerSelected = function (item) {
            $scope.sale.customer = item;
            $scope.sale.customer.full_name = item.first_name+' '+item.last_name;
            $scope.customerModal.hide();
        };
        //close customers modal
        $scope.closeCustomerList = function () {
            $scope.customerModal.hide();
        }

    })
    .controller('menuController', function () {

    })
    .controller('notificationsController', function ($scope,$http,$ionicLoading,toastr) {
        $ionicLoading.show();
        $http({
            url:url+'loadNotifications/'+sessionStorage.user_id,
            method:'GET'
        }).success(function (data) {
            $scope.notifications = data.notifications;
            $ionicLoading.hide();
        }).error(function (err) {
            console.error(err);
            toastr.error('Check your internet connection');
            $ionicLoading.hide();
        })
    })
    .controller('salesController', function ($scope,$ionicLoading,$http,toastr) {
        $scope.doRefresh = function () {
            $ionicLoading.show();
            $http({
                url:url+'/loadSales/'+sessionStorage.user_id,
                method:'GET'
            }).success(function (data) {
                $scope.sales = data.sales;//daily,,
                //weekly
                $scope.sales_wk = data.sales_wk;
                //monthly
                $scope.sales_mn = data.sales_mn;
                $scope.swk = [];
                $scope.smn = [];
                for(var key in data.sales_wk){
                    var total=0; var date=0;
                    for(var i=0; i<data.sales_wk[key].length;i++){//each week..
                        console.info(data.sales_wk[key][i]);
                        total += data.sales_wk[key][i]['total_price'];
                        date = data.sales_wk[key][i]['created_at'];
                    }

                    $scope.swk.push(Array({'total' : total,'date':date,'key':key}));
                }console.info($scope.swk);


                for(var key in data.sales_mn){
                    var total=0; var date=0;
                    for(var i=0; i<data.sales_mn[key].length;i++){//each week..
                        console.info(data.sales_mn[key][i]);
                        total += data.sales_mn[key][i]['total'];
                        date = data.sales_mn[key][i]['created_at'];
                    }

                    $scope.smn.push(Array({'total' : total,'date':date,'key':key}));
                }console.info($scope.smn);


                $scope.sales_wk = data.sales_wk;
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            }).error(function (err) {
                $ionicLoading.hide();
                console.error(err);
                toastr.error('check your internet connection and try again');
                $scope.$broadcast('scroll.refreshComplete');
            })
        };
        $ionicLoading.show();
        $http({
            url:url+'/loadSales/'+sessionStorage.user_id,
            method:'GET'
        }).success(function (data) {
            $scope.sales = data.sales;//daily,,
            //weekly
            $scope.sales_wk = data.sales_wk;
            //monthly
            $scope.sales_mn = data.sales_mn;
            $scope.swk = [];
            $scope.smn = [];
            for(var key in data.sales_wk){
                var total=0; var date=0;
                for(var i=0; i<data.sales_wk[key].length;i++){//each week..
                    console.info(data.sales_wk[key][i]);
                    total += data.sales_wk[key][i]['total_price'];
                    date = data.sales_wk[key][i]['created_at'];
                }

                $scope.swk.push(Array({'total' : total,'date':date,'key':key}));
            }console.info($scope.swk);


            for(var key in data.sales_mn){
                var total=0; var date=0;
                for(var i=0; i<data.sales_mn[key].length;i++){//each week..
                    console.info(data.sales_mn[key][i]);
                    total += data.sales_mn[key][i]['total_price'];
                    date = data.sales_mn[key][i]['created_at'];
                }

                $scope.smn.push(Array({'total' : total,'date':date,'key':key}));
            }console.info($scope.smn);


            $scope.sales_wk = data.sales_wk;
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
        }).error(function (err) {
            $ionicLoading.hide();
            console.error(err);
            toastr.error('check your internet connection and try again');
        })

    })
    .controller('invController', function ($scope,$http,toastr,$ionicModal) {
        $scope.doRefresh = function () {
            $http({
                url:url+'/loadMyInventory/'+sessionStorage.user_id,
                method:'GET'
            }).success(function (data) {
                console.info(data);
                $scope.inventory = data.inventory;
                $scope.$broadcast('scroll.refreshComplete');
            }).error(function (error) {
                toastr.error('Check your internet and try again');
                console.error(error);
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        /*adjustment modal for product*/
        $ionicModal.fromTemplateUrl('templates/adjust.html',{
            scope:$scope,
            animation: 'slide-in-right'
        }).then(function (adjustMod) {
            $scope.adjustMod = adjustMod;
        });

        /*transfer modal for product*/
        $ionicModal.fromTemplateUrl('templates/transfer.html',{
            scope:$scope,
            animation: 'slide-in-right'
        }).then(function (transferMod) {
            $scope.transferMod = transferMod;
        });


        $http({
            url:url+'/loadMyInventory/'+sessionStorage.user_id,
            method:'GET'
        }).success(function (data) {
            console.info(data);
            $scope.inventory = data.inventory;
        }).error(function (error) {
            toastr.error('Check your internet and try again');
            console.error(error)
        });
        $scope.adjust = function (index) {
            $scope.adjustMod.show();
            //whats to adjust..
            $scope.url = url;
            $scope.prod = $scope.inventory[index];
            //$scope.prod.quantity = 0;
        };
        $scope.closeAdjustMod = function () {
          $scope.adjustMod.hide();
        };
        $scope.prod = {};

            $scope.add = function () {
        if($scope.prod.quantity_adjust){
            console.info($scope.prod);
                $http({
                    url:url+'/addInventory/'+sessionStorage.user_id,
                    method:'POST',
                    headers:{'Content-Type': 'application/x-www-form-urlencoded'},
                    data:$scope.prod
                }).success(function (data) {
                    console.info(data);
                    if(data.status == 'success'){
                        toastr.success('Successfully adjusted the inventory');
                    }else{
                        toastr.error('Error updating your inventory, retty');
                    }
                }).error(function (err) {
                    console.error(err);
                    toastr.error('Check your internet connection and retry.');
                })
        }else{
            toastr.error('Enter adjust amount');
        }
                $scope.adjustMod.hide();
        };


        $scope.subtract = function () {
            if($scope.prod.quantity_adjust != undefined){
                $http({
                    url:url+'/reduceInventory/'+sessionStorage.user_id,
                    method:'POST',
                    headers:{'Content-Type': 'application/x-www-form-urlencoded'},
                    data:$scope.prod
                }).success(function (data) {
                    console.info(data);
                }).error(function (err) {
                    console.error(err);
                    toastr.error('Check your internet connection and retry.');
                })
            }else{
                toastr.error('Enter adjust amount');
            }
            $scope.adjustMod.hide();
        };

        /*transfer stock*/
        $scope.transfer = function (index) {
            $scope.url = url;
            $scope.prod = $scope.inventory[index];
            $scope.transferMod.show();
            //get sales agents
            $http({
                url:url+'/loadSalesAgents/'+sessionStorage.user_id,
                method:'GET'
            }).success(function (data) {
              console.info(data);
                $scope.sales = data.sales;
            });
        };
        /*close stock.*/
        $scope.closeTransfer  = function () {
            $scope.transferMod.hide();
        };
        $scope.transferStock = function () {
          //prod
            if($scope.prod.sale_id == undefined || $scope.prod.sale_id == undefined ||
                $scope.prod.quantity_transfer == undefined){
                toastr.error('Please select sales agent and amount to transfer');
                return;
            }
            if($scope.prod.quantity< $scope.prod.quantity_transfer){
                toastr.error('The amount exist the available in the warehouse');
                return;
            }

            $http({
                url:url+'/transferStock/'+sessionStorage.user_id,
                method:'POST',
                headers:{'Content-Type': 'application/x-www-form-urlencoded'},
                data:$scope.prod
            }).success(function (data) {
                console.info(data)
            }).error(function (err) {
                console.error(err)
            });
            $scope.transferMod.hide();
            window.location.reload(true);
        }
    })
    .controller('reportsController', function ($scope,$http,$ionicLoading) {
        $scope.doRefresh = function () {
            $ionicLoading.show();
            $http({
                url:url+'/loadReportSummary/'+sessionStorage.user_id,
                method:'GET'
            }).success(function (data) {
                $ionicLoading.hide();
                $scope.item = data;
                $scope.$broadcast('scroll.refreshComplete');
            });

        };
        $ionicLoading.show();
        $http({
            url:url+'/loadReportSummary/'+sessionStorage.user_id,
            method:'GET'
        }).success(function (data) {
            $ionicLoading.hide();
            $scope.item = data;
        });

        ///load
        /*$ionicLoading.show();
        $http({
            url:url+'/loadSalesWithTarget/'+sessionStorage.user_id,
            method:'GET'
        }).success(function (data) {
            console.info(data);
        });



        $ionicLoading.hide();
*/
    })
    .controller('incomingController', function ($scope,$http,$ionicLoading,toastr) {
        $scope.doRefresh = function () {
            $http({
                url:url+'/loadIncomingStock/'+sessionStorage.user_id,
                method:'GET'
            }).success(function (data) {
                console.info(data);
                $scope.incoming = data.incoming;
                $scope.$broadcast('scroll.refreshComplete');
            });
        };
        $http({
            url:url+'/loadIncomingStock/'+sessionStorage.user_id,
            method:'GET'
        }).success(function (data) {
            console.info(data);
            $scope.incoming = data.incoming;
        });
        $scope.Accept = function (index) {
            $http({
                url:url +'/AcceptInventory/'+sessionStorage.user_id+'?prod_id='+index,
                method:'GET'
            }).success(function (data) {
                toastr.success('successfully accepted incoming inventory');
                window.location.reload(true);
            })
        };

        $scope.reject = function (index) {
            $http({
                url:url +'/RejectInventory/'+sessionStorage.user_id+'?prod_id='+index,
                method:'GET'
            }).success(function (data) {
                toastr.success('successfully rejected incoming inventory');
                window.location.reload(true);
            })
        }
    })
    .controller('customerReportController', function ($scope,$http,$ionicLoading,toastr) {
        $scope.doRefresh = function () {
            $ionicLoading.show();
            $http({
                url:url+'/customerReport',
                method:'GET'
            }).success(function (data) {
                console.info(data);
                $scope.report = data;

                $scope.getTotalSales = function (item) {
                    var t = 0;
                    for(var i=0; i<item.length; i++)
                    {
                        t  = t + item[i]['total_price']
                    }
                    return t;
                };

                $scope.getTotalPaid = function (item) {
                    var t = 0;
                    for(var i=0; i<item.length; i++)
                    {
                        t  = t + item[i]['paid_amount']
                    }
                    return t;
                };

                $scope.getTotalDisc = function (item) {
                    var t = 0;
                    for(var i=0; i<item.length; i++)
                    {
                        t  = t + item[i]['total_discount']
                    }
                    return t;
                };
                $scope.getTotalDue = function (items) {
                    return $scope.getTotalPaid(items) - $scope.getTotalSales(items);
                };

                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            }).error(function () {
                $ionicLoading.hide();
                toastr.error('Check your internet');
                $scope.$broadcast('scroll.refreshComplete');
            })
        };
        $ionicLoading.show();
        $http({
            url:url+'/customerReport',
            method:'GET'
        }).success(function (data) {
            console.info(data);
            $scope.report = data;

            $scope.getTotalSales = function (item) {
                var t = 0;
                for(var i=0; i<item.length; i++)
                {
                    t  = t + item[i]['total_price']
                }
                return t;
            };

            $scope.getTotalPaid = function (item) {
                var t = 0;
                for(var i=0; i<item.length; i++)
                {
                    t  = t + item[i]['paid_amount']
                }
                return t;
            };

            $scope.getTotalDisc = function (item) {
                var t = 0;
                for(var i=0; i<item.length; i++)
                {
                    t  = t + item[i]['total_discount']
                }
                return t;
            };
            $scope.getTotalDue = function (items) {
              return $scope.getTotalPaid(items) - $scope.getTotalSales(items);
            };

            $ionicLoading.hide();
        }).error(function () {
            $ionicLoading.hide();
            toastr.error('Check your internet');
        })
    })
    .controller('paymentReportCustomer', function ($scope,$http,$ionicLoading) {
        $scope.doRefresh = function () {
            $ionicLoading.show();
            $http({
                url:url+'/paymentReport',
                method:'GET'
            }).success(function (data) {
                $ionicLoading.hide();
                console.info(data);
                /* pay = Array();
                 for(key in data ){
                 console.info(key);
                 pay.key = ({key:data[key]});
                 }*/

                //console.info(pay);
                $scope.getTotal = function (item) {
                    var t =0;
                    for(i=0;i<item.length; i++){
                        t += item[i]['total_price']
                    }
                    return t;
                };
                $scope.item = data;
                $scope.$broadcast('scroll.refreshComplete');
            }).error(function (error) {
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            })
        };

        $ionicLoading.show();
        $http({
            url:url+'/paymentReport',
            method:'GET'
        }).success(function (data) {
            $ionicLoading.hide();
            console.info(data);
           /* pay = Array();
            for(key in data ){
                console.info(key);
                pay.key = ({key:data[key]});
            }*/

            //console.info(pay);
            $scope.getTotal = function (item) {
                var t =0;
                for(i=0;i<item.length; i++){
                    t += item[i]['total_price']
                }
                return t;
            };

            $scope.item = data;
        }).error(function (error) {
            $ionicLoading.hide();
        })
    })
    .controller('customerController',function($scope,$http,$ionicLoading,toastr){
        $scope.doRefresh = function () {
            $ionicLoading.show();
            $http({
                url:url+'/loadCustomers',
                method:'GET'
            }).success(function (data) {
                console.info(data);
                $scope.customers = data;
                $scope.$broadcast('scroll.refreshComplete');
                $ionicLoading.hide();
            }).error(function (error) {
                $ionicLoading.hide();
                toastr.error('Check your internet connection');
                $scope.$broadcast('scroll.refreshComplete');
            })
        };

        $ionicLoading.show();
        $http({
            url:url+'/loadCustomers',
            method:'GET'
        }).success(function (data) {
            console.info(data);
            $scope.customers = data;
            $ionicLoading.hide();
        }).error(function (error) {
            $ionicLoading.hide();
            toastr.error('Check your internet connection')
        })
    })
    .controller('orderController', function ($http,$ionicLoading,$scope) {
        $ionicLoading.show();
        $http({
            url:url+'/loadOrders/'+sessionStorage.user_id,
            method:'GET'
        }).success(function (data) {
            $ionicLoading.hide();
            console.info(data);
            $scope.orders = data;
        }).error(function (err) {
            $ionicLoading.hide();
            console.error(err);
        });
    })
    .controller('verifyController', function ($state,$ionicLoading,$scope,$http,toastr) {
        //load the number provided..

        //post this number
        $scope.verifyPhone = function (data) {
            $http({
                url:url + '/loadPhoneNumber/'+sessionStorage.user_id,
                method:'POST',
                headers:{'Content-Type': 'application/x-www-form-urlencoded'},
                data: {'phone':data},
                success: function (data) {
                    if(data.status == 'success')
                    {//the verification code sent successfully
                        $state.go('verify_code');
                    }
                    if(data.status == 'error'){
                        toastr.error(data.msg);
                    }
                }
            })
        }
    })
    .controller('verify_codeController', function (toastr,$ionicLoading,$scope,$http,$state) {
        $scope.verifyCode = function (data) {
            $http({
                url: url+'/postVerifyCode/'+sessionStorage.user_id,
                method:"POST",
                headers:{'Content-Type': 'application/x-www-form-urlencoded'},
                data: {'code':data},
                success: function (data) {
                    if(data.status == 'success')
                    {
                        toastr.success('successfully verified your phone number');
                        $state.go('app.dashboard');
                    }else
                    {
                        toastr.error(data.msg);person
                    }
                }
            })
        }
    });
