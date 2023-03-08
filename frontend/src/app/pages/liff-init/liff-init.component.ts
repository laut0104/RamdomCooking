import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LiffService } from '../../services/liff.service';
import liff from '@line/liff';

@Component({
  selector: 'app-liff-init',
  templateUrl: './liff-init.component.html',
  styleUrls: ['./liff-init.component.scss']
})
export class LiffInitComponent implements OnInit {

  constructor(
    private liffSvc: LiffService
  ) { }

  ngOnInit(): void {
    // this.liffSvc.liffInit(environment.LIFF_ID)
  }


}
