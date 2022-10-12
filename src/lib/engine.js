import { default as core } from '@elemaudio/plugin-renderer';
import { el } from '@elemaudio/core';

const paramState = {
    gain: {
        value: 0.0,
        map: (x) => { return -60 + ((x-0)*(36-(-60))/(1-0)) }
    },
    bypass: {
        value: 0
    }
}

export function updateParam(name, value) {
    // dispatch setParameterValue, this should invoke a parameterValueChange event but this doesn't
    // seem to happen
    console.log('Dispatching setParameterValue: ', name, value);
    core.dispatch('setParameterValue', {name: name, value: value})
}

export function resize() {
    // dispatch resize event, this gives an error
    console.log('Dispatching resize');
    core.dispatch('resize', {width: 500, height: 500});
}

export function initEngine() {

    core.on('load', () => {
        // create audio graph from parameter state
        const [left, right] = createGraph(paramState);
        // call core.render on audio graph
        core.render(left, right);
    })

    core.on('parameterValueChange', (e) => {
        console.log('parameterValueChanged: ', e);
        // construct new parameter state
        const newVal = paramState[e.paramId].map ? paramState[e.paramId].map(e.value) : e.value;
        paramState[e.paramId].value = newVal;
        // save the new state; this dispatch does work
        core.dispatch('saveState', JSON.stringify(paramState));
        // create audio graph from parameter state
        const [left, right] = createGraph(paramState);
        // call core.render on audio graph
        core.render(left, right);
    })

    // load state event listener, this never seems to fire
    core.on('loadState', (e) => {
        console.log('Loaded state: ', e)
        // construct new parameter state
        const state = JSON.parse(e.value);
        // TODO: update the global state properly
        // TODO: send setParameterValue dispatch for each parameter
        // create audio graph from new parameter state
        const [left, right] = createGraph(state);
        // call core.render on audio graph
        core.render(left, right);
    })

    core.on('playhead', (e) => {
        // don't need this
        return;
    })

    // initialize the core
    core.initialize();

}

// assuming gain parameter is in range -60:36
const createGraph = (parameters) => {
    let left, right;
    if (parameters.bypass.value >= 0.5) {
        left = el.in({channel: 0});
        right = el.in({channel: 1});
    } else {
        const gain = (x) => el.mul(
            el.db2gain(el.const({key: 'gain', value: parameters.gain.value})),
            x
        )
        left = gain(el.in({channel: 0}));
        right = gain(el.in({channel: 1}));
    }

    return [left, right];
}