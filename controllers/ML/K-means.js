export const kmeans = (dataItems,clusterCount) =>{

    let data = dataItems;
    let means = [];
    let assignments = [];
    let dataExtremes;
    let dataRange;
    
    let  getDataRanges = (extremes) => {
        var ranges = [];
    
        for (var dimension in extremes)
        {
            ranges[dimension] = extremes[dimension].max - extremes[dimension].min;
        }
    
        return ranges;
    
    }
    
    let getDataExtremes = (points) => {
        
        var extremes = [];
    
        for (var i in data)
        {
            var point = data[i];
    
            for (var dimension in point)
            {
                if ( ! extremes[dimension] )
                {
                    extremes[dimension] = {min: 1000, max: 0};
                }
    
                if (point[dimension] < extremes[dimension].min)
                {
                    extremes[dimension].min = point[dimension];
                }
    
                if (point[dimension] > extremes[dimension].max)
                {
                    extremes[dimension].max = point[dimension];
                }
            }
        }
    
        return extremes;
    }
    
    let initMeans = (k) => {
    
        if ( ! k )
        {
            k = 3;
        }
    
        while (k--)
        {
            var mean = [];
    
            for (var dimension in dataExtremes)
            {
                mean[dimension] = dataExtremes[dimension].min + ( Math.random() * dataRange[dimension] );
            }
    
            means.push(mean);
        }
    
        return means;
    
    };
    
    let makeAssignments = () => {
    
        for (var i in data)
        {
            var point = data[i];
            var distances = [];
    
            for (var j in means)
            {
                var mean = means[j];
                var sum = 0;
    
                for (var dimension in point)
                {
                    var difference = point[dimension] - mean[dimension];
                    difference *= difference;
                    sum += difference;
                }
    
                distances[j] = Math.sqrt(sum);
            }
    
            assignments[i] = distances.indexOf( Math.min.apply(null, distances) );
        }
    
    }
    
    let moveMeans = () => {
    
        makeAssignments();
    
        var sums = Array( means.length );
        var counts = Array( means.length );
        var moved = false;
    
        for (var j in means)
        {
            counts[j] = 0;
            sums[j] = Array( means[j].length );
            for (var dimension in means[j])
            {
                sums[j][dimension] = 0;
            }
        }
    
        for (var point_index in assignments)
        {
            var mean_index = assignments[point_index];
            var point = data[point_index];
            var mean = means[mean_index];
    
            counts[mean_index]++;
    
            for (var dimension in mean)
            {
                sums[mean_index][dimension] += point[dimension];
            }
        }
    
        for (var mean_index in sums)
        {
            console.log(counts[mean_index]);
            if ( 0 === counts[mean_index] ) 
            {
                sums[mean_index] = means[mean_index];
                console.log("Mean with no points");
                console.log(sums[mean_index]);
    
                for (var dimension in dataExtremes)
                {
                    sums[mean_index][dimension] = dataExtremes[dimension].min + ( Math.random() * dataRange[dimension] );
                }
                continue;
            }
    
            for (var dimension in sums[mean_index])
            {
                sums[mean_index][dimension] /= counts[mean_index];
            }
        }
    
        if (means.toString() !== sums.toString())
        {
            moved = true;
        }
    
        means = sums;
    
        return moved;
    
    }
    
    let formCluster = (size = clusterCount) => {
    
        dataExtremes = getDataExtremes(data);
        dataRange = getDataRanges(dataExtremes);
        means = initMeans(size);
    
        return {mean: means, extremes: dataExtremes,range: dataRange }
    }
    
    return formCluster()

}