import {Pipe, PipeTransform} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {HttpClient} from "@angular/common/http";


@Pipe({
    name: 'secure'
})
export class SecurePipe implements PipeTransform {

    constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

    transform(url): Observable<SafeUrl> {
        console.log(url);
        return this.http
            .get(url, { responseType: 'blob' })
            .map(val => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(val)));
    }
}