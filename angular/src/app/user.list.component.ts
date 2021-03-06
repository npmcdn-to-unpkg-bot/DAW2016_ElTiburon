import {Component,Input, OnChanges, OnInit, Output, EventEmitter, SimpleChange}   from 'angular2/core';
import {ROUTER_DIRECTIVES,RouteParams, Router} from 'angular2/router';
import {UserService, User } from './user.service';
import {FollowService, Follow} from './follow.service';

@Component({
  selector: 'user-list',
  directives: [ROUTER_DIRECTIVES],
  templateUrl: 'app/user.list.component.html'
})


export class UserListComponent implements OnInit, OnChanges{
  @Input()
  private follows;

  @Input()
  private type : string;
  @Output()
  private refresh = new EventEmitter<boolean>();

  private list = [];
  private actualUser : Follow;
  private id : number;
  private show = false;
  private idLogged = 0;

  constructor(
    private uService : UserService,
    private router : Router,
    private routeParams: RouteParams,
    private fService : FollowService
  ){}

  ngOnInit(){
    if(this.uService.getLogueado()){
      this.fService.getFollow(this.uService.getIdUserLogued()).subscribe(
        f => {
          this.actualUser = f
          this.idLogged = this.uService.getIdUserLogued();
        }
      );
    }else{
      this.actualUser = undefined;
      this.idLogged = 0;
    }
  }
  ngOnChanges(){

    if(this.uService.getLogueado()){
      this.fService.getFollow(this.uService.getIdUserLogued()).subscribe(
        f => {
          this.actualUser = f
          this.idLogged = this.uService.getIdUserLogued();
          if(this.follows){
            this.list = [];
            console.log('lista follows')
            console.log(this.follows)
            for(let f of this.follows){
              console.log('añado',f)
              console.log(this.list.push(new UserAux(f,this.fService.isFollowing(this.actualUser,f))));
            }
          }
          console.log('lista logueado')
          console.log(this.list)
        }
      );
    }else{
      this.actualUser = undefined;
      this.idLogged = 0;
      this.list = [];
      if(this.follows){
        for(let f of this.follows){
          this.list.push(new UserAux(f,this.fService.isFollowing(this.actualUser,f)));
        }
      }
    }
  }

  refreshList(b:boolean){
    this.refresh.next(true);
  }

  seguir(id){
    if(this.uService.getIdUserLogued()!=0){
      this.fService.addFollow(this.uService.getIdUserLogued(),id).subscribe(
        response => {
          this.refreshList(true);
        }
      );
    }else{
      this.router.navigate(['Login']);
    }

  }
  noSeguir(id){
    this.fService.removeFollow(this.actualUser.user.id,id).subscribe(
      response => {
        this.refreshList(true);
      }
    );

  }

}


export class UserAux{
  constructor(
    public follow : Follow,
    public isFollowing : boolean
  ){}
}
