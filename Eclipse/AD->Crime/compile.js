function compile(mainPath, env) {
    const main = DiagramPaths.findMain(mainPath, env);
    
    const ctx = DiagramContext.main(main, new EnvironmentCache(env));
    const compiledMain = compileDiagram(ctx);
    
    if (compiledMain.processedOrNull !== null) {
        throw new Error("Unexpected stable state at main initial node");
    }
    
    const steps = [];
    steps.push(...compiledMain.steps);
    
    let next = successorSumExprNoData(compiledMain.firstLocation);
    if (ctx.dataDistribution.isEnabled) {
        steps.push(...ctx.dataDistribution.initializationSteps(ctx, next));
        next = ctx.dataDistribution.startInitialization();
    }
    
    steps.push(globalInitialStep(ctx, next));
    const model = new CrimeModel(steps, ctx.preferredValues.expose());
    
    return new CompiledModel(model, ctx.dictionaryBuilder.build());
}