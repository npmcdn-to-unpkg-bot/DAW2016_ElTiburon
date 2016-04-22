import {Component}   from 'angular2/core';
import {ROUTER_DIRECTIVES,RouteParams, Router} from 'angular2/router';
import {UserService} from './user.service';

@Component({
  selector: 'main',
  directives: [ROUTER_DIRECTIVES],
  templateUrl: 'app/login.component.html'

})

export class LoginComponent{

  private failNick:boolean=false;
  private failNickExist:boolean=false;
  private failEmailEquals:boolean=false;
  private failEmailExist:boolean=false;
  private failPassFormat:boolean=false;
  private failPassEquals:boolean=false;
  private failType:boolean=false;


  constructor(
    private router:Router,
    private service : UserService
  ){}

  entrar(nick:string,pass:string){
    if(this.service.isUserCorrect(nick,pass)){
      this.router.navigate(['Inicio']);
    }
  }

}