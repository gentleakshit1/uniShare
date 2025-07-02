from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .forms import ResourceUploadForm
from .models import Resource
from django.contrib.admin.views.decorators import staff_member_required
from django.core.paginator import Paginator
from django.contrib import messages


@login_required
def user_dashboard(request):
    user_resources = Resource.objects.filter(uploaded_by=request.user).order_by('-created_at')
    return render(request, 'core/dashboard.html', {'resources': user_resources})


@staff_member_required
def delete_resource(request, resource_id):
    resource = get_object_or_404(Resource, id=resource_id)
    resource.delete()
    messages.warning(request, "Resource deleted 🗑️")
    return redirect('resource_list')

@login_required
def upload_resource(request):
    if request.method == 'POST':
        form = ResourceUploadForm(request.POST, request.FILES)
        if form.is_valid():
            resource = form.save(commit=False)
            resource.uploaded_by = request.user
            resource.save()
            messages.success(request, "Upload successful! ✅")
            return redirect('resource_list')
    else:
        form = ResourceUploadForm()
    return render(request, 'core/upload.html', {'form': form})

def resource_list(request):
    query = request.GET.get('q')
    category = request.GET.get('category')
    resources = Resource.objects.all().order_by('-created_at')

    if query:
        resources = resources.filter(title__icontains=query)

    if category:
        resources = resources.filter(category=category)

    paginator = Paginator(resources, 6)  # 6 resources per page
    page = request.GET.get('page')
    paged_resources = paginator.get_page(page)

    return render(request, 'core/resource_list.html', {
        'resources': paged_resources,
        'selected_category': category,
        'query': query,
    })

@staff_member_required
def edit_resource(request, resource_id):
    resource = get_object_or_404(Resource, id=resource_id)

    if request.method == 'POST':
        form = ResourceUploadForm(request.POST, request.FILES, instance=resource)
        if form.is_valid():
            form.save()
            messages.success(request, 'Resource updated successfully.')
            return redirect('/')
    else:
        form = ResourceUploadForm(instance=resource)

    return render(request, 'core/edit_resource.html', {'form': form, 'resource': resource})
