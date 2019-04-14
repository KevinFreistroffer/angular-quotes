import { Component, OnInit } from "@angular/core";
import { ChuckNorrisService } from "../chuck-norris.service";
import { UserService } from "../user.service";
import { Quote } from "../quote_interface";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  viewTitle: string = "My Dashboard";
  quotes = [];
  favoritedQuotes: string[] = [];
  storedToBeSaved: string[] = [];
  isLoading: boolean = false;
  selectedQuote = {};
  numOfSelectedQuotes: number = 0;

  constructor(
    private chuckService: ChuckNorrisService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.getQuotes();

    document.title = "Dashboard";

    this.userService.user$.subscribe(
      user => {
        // Shouldn't have to check for this property.
        if (user && user.hasOwnProperty("quotes")) {
          this.favoritedQuotes = user.quotes;
        }
      },
      error => {
        console.log(`An error occured subscribing to user$`, error);
      }
    );
  }

  getQuotes() {
    this.isLoading = true;
    this.chuckService.getQuotes().subscribe(
      quotes => {
        this.quotes = quotes.map(quote => {
          quote.checked = false;
          return quote;
        });
        this.isLoading = false;
      },
      errors => {
        console.log(`An error occured fetching quotes`, errors);
        this.isLoading = false;
      }
    );
  }

  handleOnChange(quote) {
    this.storedToBeSaved = [...this.quotes.filter(quote => quote.checked)];
  }

  saveFavoriteQuotes() {
    let quotesConcatinated: string = ""; // to be saved as a string in mysql.
    this.isLoading = true;
    this.favoritedQuotes = [...this.favoritedQuotes, ...this.storedToBeSaved];

    this.favoritedQuotes.forEach(quote => {
      // Include a | at the end to show a separator between each quote.
      // Should be something more unique such as __END_OF_QUOTE__
      quotesConcatinated += quote + "|";
    });

    this.chuckService.saveFavoriteQuotes(quotesConcatinated).subscribe(
      ({ status, data }) => {
        if (status === 200) {
          this.storedToBeSaved = [];
          console.log(data);
          this.setUser(data);
        }
        
        setTimeout(() => {
          this.isLoading = false;
        }, 1800);
      },
      error => {
        this.isLoading = false;
      }
    );
  }

  refresh() {
    this.quotes = [];
    this.favoritedQuotes = [...this.favoritedQuotes, ...this.storedToBeSaved];
    this.storedToBeSaved = [];
    this.getQuotes();
  }
}
