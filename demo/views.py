from django.shortcuts import render
from django.http import HttpResponse, HttpRequest
from demo.forms import DutyForm


def home(request: HttpRequest) -> HttpResponse:
    form = DutyForm(initial={'inlet_pressure': 101325.0})
    if request.method == "POST":
        if form.is_valid():
            form.clean()
    return render(request, "demo/demo_with_db.html", dict(form=form))


def convert(request: HttpRequest) -> HttpResponse:
    return render(request, "demo/convert.html", {})