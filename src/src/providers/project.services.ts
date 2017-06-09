import { Injectable } from '@angular/core';
import { HttpClientService } from '../providers/http-client-service';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';

export class ProjectModel {
    id: number;
    name: string;
    pinCode: string;
}

class ProjectListModel {
    projects: Array<ProjectModel>;
    timestamp: number;

    isValid() {
        if (!this.projects) {
            return false;
        }

        let age = Date.now() - this.timestamp;
        if (age > 300000) {
            console.log(`ProjectsList collection is expired at ${age}ms.`)
            return false;
        }

        return true;
    }
}


@Injectable()
export class ProjectService {

    private projectList: ProjectListModel;
    private storageDbName: string = 'Tickting:selectedProjectStorage';

    constructor(private http: HttpClientService,
                private storage: Storage) {
        this.projectList = new ProjectListModel();
    }

    public getProjects(): Observable<any> {

        if (this.projectList.isValid()) {
            console.log('Getting projects from memory...');
            return Observable.of(this.projectList.projects);
        }

        console.log('Getting projects from server...');

        return this.http.get("project").map(res => res.json()).map(data => {
            this.projectList.projects = data;
            this.projectList.timestamp = Date.now();
            return this.projectList.projects;
        });
    }

    public setProject(project: ProjectModel) {
        this.storage.set(this.storageDbName, JSON.stringify(project));
    }

    public getById(projectId: number): Observable<any> {
        return Observable.create(observable => {
            this.getProjects().subscribe((projects) => {
                observable.next(projects.find(proj => proj.id == projectId));
                observable.complete();
            });
        });
    }

    public getCurrentProject(): Observable<ProjectModel> {
        return Observable.create(observable => {
            this.storage.get(this.storageDbName).then(data => {
                let project = JSON.parse(data);
                if (!project || !project.id) {
                    observable.next();
                    observable.complete();
                }
                observable.next(project);
                observable.complete();                
            });
        });
    }


}