function compileDiagram(ctx) {
    const controlNodes = ctx.diagram().getNodes().filter(node => node instanceof ControlNode);
    const controlFlowsNotToBlockNode = ctx.diagram().getControlFlows().filter(flow => NOT_TO_BLOCK_NODE(flow));
    const allSteps = [];
    const processedForStable = new Map();
    const locationForNode = new Map();
    const locationForFlow = new Map();

    const nodes = [...controlNodes].filter(node => node instanceof ActivityNode || node instanceof BusinessActivityNode);
    for (const node of nodes) {
        const outgoingOrNull = node.getControlFlowsOut().length === 1 ? node.getControlFlowsOut()[0] : null;
        let successor;
        if (outgoingOrNull) {
            const fields = flowLocationFieldsNoEventTarget(ctx, outgoingOrNull);
            successor = createFlowLocation(ctx, outgoingOrNull, fields);
            locationForFlow.set(outgoingOrNull, successor);
        } else {
            successor = ctx.returnLocation;
        }
        let compiled;
        if (node instanceof ActivityNode) {
            compiled = activityNode(ctx, node, successor);
        } else {
            compiled = businessActivityNode(ctx, node, successor);
        }
        locationForNode.set(node, compiled.firstLocation);
        allSteps.push(...compiled.steps);
        if (compiled.processedOrNull) {
            processedForStable.set(compiled.processedOrNull.qualified, compiled.processedOrNull);
        }
    }
    
    // Done processing stable states.
    for (const flow of controlFlowsNotToBlockNode) {
        if (!locationForFlow.has(flow)) {
            const fields = flowLocationFields(ctx, flow, processedForStable);
            locationForFlow.set(flow, createFlowLocation(ctx, flow, fields));
        }
    }
    
    // Done compiling control flows.
    for (const node of controlNodes) {
        if (locationForNode.has(node)) {
            // Handled earlier.
        } else if (node instanceof BlockNode) {
            // Server does not need to know about block nodes.
        } else {
            const fields = neverStableNodeLocationFields(ctx, node, processedForStable);
            const current = createNodeLocation(ctx, node, fields);
            locationForNode.set(node, current);
            let steps;
            if (node instanceof InitialNode) {
                steps = initialNode(ctx, node, current, locationForFlow);
            } else if (node instanceof MergeNode) {
                steps = mergeNode(ctx, node, current, locationForFlow);
            } else if (node instanceof EventNode) {
                steps = eventNode(ctx, node, current, locationForFlow, processedForStable);
            } else if (node instanceof FinalNode) {
                steps = finalNode(ctx, node, current);
            } else if (node instanceof TerminateNode) {
                steps = terminateNode(ctx, node, current);
            } else if (node instanceof DecisionNode) {
                steps = decisionNode(ctx, node, current, locationForFlow);
            } else {
                throw new Error("Unexpected node " + node);
            }
            allSteps.push(...steps);
        }
    }
    
    // Done compiling nodes.
    for (const flow of controlFlowsNotToBlockNode) {
        allSteps.push(flowStep(ctx, flow, locationForFlow.get(flow), locationForNode.get(flow.getTo()), processedForStable));
    }
    
    const initial = controlNodes.find(node => node instanceof InitialNode);
    console.log(allSteps);
    return new StepsWithStable(locationForNode.get(initial), allSteps, processedForCallerOrNull(ctx, initial, processedForStable));
}