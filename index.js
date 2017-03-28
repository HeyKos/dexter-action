// Copyright 2016, Google, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

process.env.DEBUG = 'actions-on-google:*';

const ActionsSdkAssistant = require('actions-on-google').ActionsSdkAssistant,
      Dexter              = require('./dexter.js'),
      dexter              = new Dexter(),
      actionMap           = new Map(),
      RAW_INTENT          = 'raw.input';

/**
 * Configures the post request handler by setting the intent map to the right functions.
 */
actionMap.set(new ActionsSdkAssistant().StandardIntents.MAIN, dexter.mainHandler);
actionMap.set(RAW_INTENT, dexter.pokedexHandler);
actionMap.set(new ActionsSdkAssistant().StandardIntents.TEXT, dexter.pokedexHandler);

/**
 * Handles the post request incoming from Assistant.
 */
exports.dexter = (req, res) => {
  console.log('Incoming post request...');
  const assistant = new ActionsSdkAssistant({request: req, response: res});
  assistant.handleRequest(actionMap);
};
