from django import forms


class CustomPressureWidget(forms.TextInput):
    template_name = 'demo/custom_widgets/custom_pressure_widget.html'


class DutyForm(forms.Form):
    inlet_pressure = forms.FloatField(widget=CustomPressureWidget())