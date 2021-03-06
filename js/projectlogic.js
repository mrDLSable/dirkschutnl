//Returns an HTML string of the given projects, sorted by createddate.
function getProjectsString(projectsToRender){
    console.log(`getProjectsString`);
    let sortable = [];
    for(tempProject in projectsToRender){
        sortable.push([tempProject, projectsToRender[tempProject].createddate]);
    }
    sortable.sort(function(a, b){
        return b[1] - a[1];
    });

    let projectsString = `<div class='card-deck projectsRow'>`;
    let colCounter = 0;

    for(projectID in sortable){
        let projectName = sortable[projectID][0];
        let tempProject = projectData[projectName];

        //Make projects into rows
        if(colCounter == 3){
            colCounter = 0;
            projectsString += `</div><div class='card-deck projectsRow'>`;
        }
        colCounter++;

        switch(tempProject.type){
            case PROJECTTYPE_PROGRAMMING:
                projectsString += `<div class='card project'><div class='card-header'>`;
                
                projectsString += `<div class="btn-group buttons" role="group" aria-label="Basic example">`;
                projectsString += `<a class='btn btn-outline-secondary' role='button' target='_blank' href='${tempProject.source}'><img class='icon' src='img/src.svg' /></a>`;
                if(tempProject.location != null){
                    projectsString += `<a class='btn btn-outline-secondary' role='button' target='_blank' href='${tempProject.location}'><img class='icon' src='img/live.svg' /></a>`;
                }
                projectsString += `</div>`;

                projectsString += `<h5 class='card-title'><a href='#' onclick='onProjectClick("${projectName}")'>${projectName}</a></h5></div>`;

                projectsString += `<div class='card-body'>`;

                projectsString += `<h6 class='card-subtitle'>Created: ${tempProject.createddate}</h6>`;
                projectsString += `<p>${tempProject.description}</p>`;

                //Render the Releases
                let releases = [];
                for(tempRelease in tempProject.releases){
                    releases.push([tempRelease, new Date(tempProject.releases[tempRelease].releasedate).getTime()]);
                }
                releases.sort(function(a, b){
                    return b[1] - a[1];
                });

                projectsString += `</div>`;


                if(releases.length > 0){
                    let tempRelease = tempProject.releases[releases[0][0]];
                    projectsString += `<ul class='list-group list-group-flush'><li class='list-group-item'>`;
                    projectsString += `<div class="btn-group buttons" role="group" aria-label="Basic example">`;
                    projectsString += `<a class='btn btn-outline-secondary' role='button' target='_blank' href='${tempRelease.download}'><img class='icon' src='img/down.svg' /></a>`;
                    projectsString += `<a class='btn btn-outline-secondary' role='button' target='_blank' href='${tempRelease.URL}'><img class='icon' src='img/info.svg' /></a>`;
                    projectsString += `</div>`;
                    projectsString += `<h4 class='card-title'>${releases[0][0]}</h4>`;
                    projectsString += `<h6 class='card-subtitle'>Released: ${tempRelease.releasedate}</h6>`;
                    projectsString += `<p>${tempRelease.info}</p>`;
                    projectsString += `</li></ul>`;
                }

                //Render the categories
                projectsString += `<div class='card-footer'>`;
                let first = true;
                for(category in tempProject.categories){
                    if(first){
                        first = false;
                    }else{
                        projectsString += `, `;
                    }
                    projectsString += `<a href='#' onclick='onProjectCategoryClick("${tempProject.categories[category]}")'>${tempProject.categories[category]}</a>`;
                }

                projectsString += `</div>`;
                projectsString += `</div>`;
                break;
        }
    }

    projectsString += `</div>`;
    return projectsString;
}

//Returns all the projects with a given category.
function getProjectsByCategory(category){
    let tempProjects = {};
    for(tempProject in projectData){
        if(projectData[tempProject].categories.includes(category)){
            tempProjects[tempProject] = projectData[tempProject];
        }
    }
    return tempProjects;
}

//Render all the projects without a filter
function renderAllProjects(){
    let pageString = `<h1>All Projects</h1>`;
    pageString += getProjectsString(projectData);
    $(`main`).html(pageString);
}

//Renders all the projects of a given category as a page
function renderProjectsCategory(category){
    console.log(`renderProjectcsCategory: ${category}`);
    let pageString = `<h1>${category}</h1>`;
    pageString += getProjectsString(getProjectsByCategory(category));
    $(`main`).html(pageString);
}

//Renders the given project
function renderProjectPage(projectName){
    let project = projectData[projectName];

    console.log("PROJECT: " + projectName);
    console.log(project);

    let pageString = `
        <div class='projectPage card'>
            <div class='card-header'>
                <h1 class='card-title'>${projectName}</h1>
                <div class="btn-group buttons" role="group" aria-label="Basic example">
                    <a class='btn btn-outline-secondary source' role='button' target='_blank' href='${project.source}'><img class='icon' src='img/src.svg' /></a>
                    `;
                    if(typeof project.location !== 'undefined') {pageString += `<a class='btn btn-outline-secondary location' role='button' target='_blank' href='${project.location}'><img class='icon' src='img/live.svg' /></a>`};
                pageString += `</div>
            </div>
            <div class='card-body'>
                <h3 class='card-subtitle'>Created: ${project.createddate}</h3>
                <p>${project.description}</p>
            </div>`;

    //sort releases
    let releases = [];
    for(tempRelease in project.releases){
        releases.push([tempRelease, new Date(project.releases[tempRelease].releasedate).getTime()]);
    }
    releases.sort(function(a, b){
        return b[1] - a[1];
    });

    //add releases
    if(releases.length > 0){
        pageString += `<ul class='list-group list-group-flush'>`;
        for(tempRelease in releases){
            release = project.releases[releases[tempRelease][0]];
            pageString += `
                <li class='list-group-item'>
                    <div class="btn-group buttons" role="group" aria-label="Basic example">
                        <a class='btn btn-outline-secondary' role='button' target='_blank' href='${release.download}'><img class='icon' src='img/down.svg' /></a>
                        <a class='btn btn-outline-secondary' role='button' target='_blank' href='${release.URL}'><img class='icon' src='img/info.svg' /></a>
                    </div>
                    <h4 class='card-title'>${releases[tempRelease][0]}</h4>
                    <h6 class='card-subtitle'>Released: ${release.releasedate}</h6>
                    <p>${release.info}</p>
                </li>
            `;
        }
        pageString += `</ul>`;
    }

    pageString += `</div>`;
    

    $(`main`).html(pageString);
}

//Sets the category and calls the loadPage when a category is clicked
function onProjectCategoryClick(category){
    console.log(category);
    localStorage.setItem(`category`, category);
    loadPage(`projectCategory`);
}

//Sets the category and calls LoadPage
function onProjectClick(project){
    console.log(project);
    localStorage.setItem(`project`, project);
    loadPage(`project`);
}