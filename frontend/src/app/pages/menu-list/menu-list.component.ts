import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss']
})
export class MenuListComponent implements OnInit {
  public menus = [
    {
      name: '料理テスト',
    },
    {
      name: '料理です'
    }

  ];
  displayedColumns: string[] = ['menu-name', 'button'];

  constructor() { }

  ngOnInit(): void {
  }

}
