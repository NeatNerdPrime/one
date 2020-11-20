/* -------------------------------------------------------------------------- */
/* Copyright 2002-2020, OpenNebula Project, OpenNebula Systems                */
/*                                                                            */
/* Licensed under the Apache License, Version 2.0 (the "License"); you may    */
/* not use this file except in compliance with the License. You may obtain    */
/* a copy of the License at                                                   */
/*                                                                            */
/* http://www.apache.org/licenses/LICENSE-2.0                                 */
/*                                                                            */
/* Unless required by applicable law or agreed to in writing, software        */
/* distributed under the License is distributed on an "AS IS" BASIS,          */
/* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   */
/* See the License for the specific language governing permissions and        */
/* limitations under the License.                                             */
/* -------------------------------------------------------------------------- */

define(function (require) {

    var Config = require("sunstone-config");  
  
    // user config
    const fireedge_endpoint = Config.fireedgeEndpoint;
    const max_tries = Config.maxWaitingTries;
    const session_var = 'fireedge_running';

    // Recursive function to validate if Fireedge Server is running 
    var _is_fireedge_running = function(tries, success_function, error_function) {

        if (!success_function){
            success_function = function() {
                sessionStorage.setItem(session_var, "true");
            };
        }

        if (!error_function){
            error_function = function() {
                sessionStorage.removeItem(session_var);
                setTimeout(function(){
                    _is_fireedge_running(tries+1, success_function);
                }, 1000);
            };
        }

        var fireedge_running = sessionStorage.getItem(session_var);
        if (!fireedge_running && (tries < max_tries)){
            _request(success_function,error_function);
        }
    }
    
    var _request = function(success_function, error_function){
        $.ajax({
            url: fireedge_endpoint,
            type: "GET",
            success: typeof success_function == "function" ? success_function : function() {},
            error: typeof success_function == "function" ? error_function : function() {}
        });
    }

    var _validate_fireedge = function() {
        _is_fireedge_running(0);
    }

    var _validate_fireedge_with_different_success = function(success) {
        _is_fireedge_running(0,success);
    }
  
    var fireedge_validator = {
      "validateFireedge": _validate_fireedge,
      "validateFireedgeWithDifferentSuccess": _validate_fireedge_with_different_success,
      "request": _request,
      "sessionVar": session_var
    };
  
    return fireedge_validator;
  });